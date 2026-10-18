package com.krishione.slotbooking;

import com.krishione.auth.User;
import com.krishione.auth.UserRepository;
import com.krishione.common.KrishiException;
import com.krishione.mandiprices.Mandi;
import com.krishione.mandiprices.MandiRepository;
import com.krishione.notifications.SmsNotificationService;
import com.krishione.slotbooking.dto.BookingResponse;
import com.krishione.slotbooking.dto.CreateSlotRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SlotBookingService {

    private final SlotRepository slotRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final MandiRepository mandiRepository;
    private final LockManager lockManager;
    private final SmsNotificationService smsNotificationService;
    private final org.springframework.transaction.support.TransactionTemplate transactionTemplate;

    public SlotBookingService(SlotRepository slotRepository,
                              BookingRepository bookingRepository,
                              UserRepository userRepository,
                              MandiRepository mandiRepository,
                              LockManager lockManager,
                              SmsNotificationService smsNotificationService,
                              org.springframework.transaction.PlatformTransactionManager transactionManager) {
        this.slotRepository = slotRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.mandiRepository = mandiRepository;
        this.lockManager = lockManager;
        this.smsNotificationService = smsNotificationService;
        this.transactionTemplate = new org.springframework.transaction.support.TransactionTemplate(transactionManager);
        this.transactionTemplate.setIsolationLevel(org.springframework.transaction.TransactionDefinition.ISOLATION_READ_COMMITTED);
    }

    /**
     * High-Concurrency Slot Booking Engine:
     * Combines Distributed/JVM Locking (Tier 1-3) with PostgreSQL SELECT ... FOR UPDATE (Tier 4)
     * to guarantee absolute zero double-booking under extreme demand.
     */
    public BookingResponse bookSlot(Long userId, Long slotId) {
        String lockKey = "slot_" + slotId;
        return lockManager.executeWithLock(lockKey, 5, 10, () -> 
            transactionTemplate.execute(status -> executeTransactionalBooking(userId, slotId))
        );
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public BookingResponse executeTransactionalBooking(Long userId, Long slotId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new KrishiException("User not found", HttpStatus.NOT_FOUND));

        // Tier 4: DB Row-Level Pessimistic Write Lock (SELECT ... FOR UPDATE)
        Slot slot = slotRepository.findByIdForUpdate(slotId)
                .orElseThrow(() -> new KrishiException("Slot not found", HttpStatus.NOT_FOUND));

        // 1. Prevent duplicate booking by the same user for this slot
        if (bookingRepository.existsByUserIdAndSlotIdAndStatus(userId, slotId, BookingStatus.CONFIRMED)) {
            throw new KrishiException("You already hold a confirmed token for this slot", HttpStatus.CONFLICT);
        }

        // 2. Strict capacity check
        if (slot.getBookedCount() >= slot.getTotalCapacity()) {
            throw new KrishiException("Slot is completely full. No tokens available.", HttpStatus.BAD_REQUEST);
        }

        // 3. Atomic capacity update
        slot.setBookedCount(slot.getBookedCount() + 1);
        Slot savedSlot = slotRepository.save(slot);

        // 4. Generate unique token receipt code
        String shortPrefix = slot.getSlotType().name().length() >= 4 
                ? slot.getSlotType().name().substring(0, 4) 
                : slot.getSlotType().name();
        String uniqueCode = "K1-" + shortPrefix + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        Booking booking = new Booking(user, savedSlot, uniqueCode, BookingStatus.CONFIRMED);
        Booking savedBooking = bookingRepository.save(booking);

        // 5. Send confirmation SMS
        try {
            smsNotificationService.sendBookingConfirmation(
                    user,
                    savedBooking.getBookingCode(),
                    savedSlot.getMandi().getName(),
                    savedSlot.getItemName(),
                    savedSlot.getSlotDate(),
                    savedSlot.getStartTime(),
                    savedSlot.getEndTime()
            );
        } catch (Exception e) {
            // SMS failure should never roll back confirmed booking
        }

        return toResponse(savedBooking);
    }

    @Transactional
    public List<Slot> getAvailableSlots(Long mandiId, SlotType type, LocalDate date) {
        LocalDate today = LocalDate.now();
        if (mandiId != null || type != null || date != null) {
            List<Slot> filtered = slotRepository.filterSlots(mandiId, type, date, today);
            if (!filtered.isEmpty()) {
                return filtered;
            }
        }

        List<Slot> upcoming = slotRepository.findBySlotDateGreaterThanEqualOrderBySlotDateAsc(today);
        if (upcoming.isEmpty()) {
            // Auto-refresh past seed slots to current date so demo and reservation portal is never empty
            List<Slot> all = slotRepository.findAll();
            if (!all.isEmpty()) {
                for (Slot s : all) {
                    if (s.getSlotDate().isBefore(today)) {
                        s.setSlotDate(today);
                        slotRepository.save(s);
                    }
                }
                upcoming = slotRepository.findBySlotDateGreaterThanEqualOrderBySlotDateAsc(today);
            }
        }
        return upcoming;
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByBookedAtDesc(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public void cancelBooking(Long userId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new KrishiException("Booking not found", HttpStatus.NOT_FOUND));

        if (!booking.getUser().getId().equals(userId)) {
            throw new KrishiException("You are not authorized to cancel this booking", HttpStatus.FORBIDDEN);
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new KrishiException("Booking is already cancelled", HttpStatus.BAD_REQUEST);
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        // Decrement slot booked count
        Slot slot = slotRepository.findByIdForUpdate(booking.getSlot().getId())
                .orElseThrow(() -> new KrishiException("Slot not found", HttpStatus.NOT_FOUND));
        if (slot.getBookedCount() > 0) {
            slot.setBookedCount(slot.getBookedCount() - 1);
            slotRepository.save(slot);
        }
    }

    @Transactional
    public Slot createSlot(CreateSlotRequest request) {
        Mandi mandi = mandiRepository.findById(request.getMandiId())
                .orElseThrow(() -> new KrishiException("Mandi not found", HttpStatus.NOT_FOUND));

        Slot slot = new Slot(
                mandi,
                request.getSlotType(),
                request.getItemName(),
                request.getSlotDate(),
                request.getStartTime(),
                request.getEndTime(),
                request.getTotalCapacity()
        );

        return slotRepository.save(slot);
    }

    private BookingResponse toResponse(Booking booking) {
        BookingResponse res = new BookingResponse();
        res.setId(booking.getId());
        res.setBookingCode(booking.getBookingCode());
        res.setStatus(booking.getStatus());
        res.setBookedAt(booking.getBookedAt());

        Slot s = booking.getSlot();
        res.setSlotId(s.getId());
        res.setSlotType(s.getSlotType());
        res.setItemName(s.getItemName());
        res.setSlotDate(s.getSlotDate());
        res.setStartTime(s.getStartTime());
        res.setEndTime(s.getEndTime());

        res.setMandiId(s.getMandi().getId());
        res.setMandiName(s.getMandi().getName());
        res.setMandiDistrict(s.getMandi().getDistrict());

        res.setFarmerName(booking.getUser().getName());
        res.setFarmerPhone(booking.getUser().getPhone());
        return res;
    }
}
