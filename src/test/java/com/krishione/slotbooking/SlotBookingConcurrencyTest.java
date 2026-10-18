package com.krishione.slotbooking;

import com.krishione.auth.Role;
import com.krishione.auth.User;
import com.krishione.auth.UserRepository;
import com.krishione.mandiprices.Mandi;
import com.krishione.mandiprices.MandiRepository;
import com.krishione.notifications.SmsNotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SlotBookingConcurrencyTest {

    @Mock
    private SlotRepository slotRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MandiRepository mandiRepository;

    @Mock
    private SmsNotificationService smsNotificationService;

    @Mock
    private org.springframework.transaction.PlatformTransactionManager transactionManager;

    private LockManager lockManager;
    private SlotBookingService slotBookingService;

    private Slot sharedSlot;
    private Mandi testMandi;

    @BeforeEach
    void setUp() {
        lockManager = new LockManager(); // Uses JVM in-memory ReentrantLock fallback
        slotBookingService = new SlotBookingService(
                slotRepository,
                bookingRepository,
                userRepository,
                mandiRepository,
                lockManager,
                smsNotificationService,
                transactionManager
        );

        testMandi = new Mandi("Indore Mandi", "Indore", "Madhya Pradesh");
        testMandi.setId(1L);

        // A slot with total capacity = 5
        sharedSlot = new Slot(
                testMandi,
                SlotType.FERTILIZER,
                "DAP Fertilizer Token",
                LocalDate.now(),
                "08:00 AM",
                "11:00 AM",
                5
        );
        sharedSlot.setId(10L);
        sharedSlot.setBookedCount(0);
    }

    @Test
    @DisplayName("Verify that under 30 concurrent booking threads, exactly 5 succeed and 25 fail gracefully")
    void testConcurrentBookingZeroDoubleBooking() throws InterruptedException {
        int totalThreads = 30;
        int maxCapacity = 5;

        ExecutorService executor = Executors.newFixedThreadPool(totalThreads);
        CountDownLatch startGate = new CountDownLatch(1);
        CountDownLatch doneGate = new CountDownLatch(totalThreads);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);
        List<Booking> savedBookings = Collections.synchronizedList(new ArrayList<>());

        // Mock repository behaviors simulating concurrent database operations
        when(slotRepository.findByIdForUpdate(10L)).thenAnswer(inv -> Optional.of(sharedSlot));
        when(slotRepository.save(any(Slot.class))).thenAnswer(inv -> inv.getArgument(0));
        when(bookingRepository.existsByUserIdAndSlotIdAndStatus(anyLong(), eq(10L), eq(BookingStatus.CONFIRMED)))
                .thenReturn(false);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> {
            Booking b = inv.getArgument(0);
            b.setId((long) (savedBookings.size() + 1));
            savedBookings.add(b);
            return b;
        });

        for (int i = 0; i < totalThreads; i++) {
            final long userId = 1000L + i;
            User user = new User("9876543" + String.format("%03d", i), "hash", "Farmer " + i, Role.FARMER, "hi");
            user.setId(userId);

            when(userRepository.findById(userId)).thenReturn(Optional.of(user));

            executor.submit(() -> {
                try {
                    startGate.await(); // Synchronize all threads to fire simultaneously
                    slotBookingService.bookSlot(userId, 10L);
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    failureCount.incrementAndGet();
                } finally {
                    doneGate.countDown();
                }
            });
        }

        // Release the latch to start concurrent onslaught
        startGate.countDown();
        boolean completed = doneGate.await(10, TimeUnit.SECONDS);
        executor.shutdown();

        assertTrue(completed, "All threads must complete within timeout");
        assertEquals(maxCapacity, successCount.get(), "Exactly " + maxCapacity + " bookings must succeed");
        assertEquals(totalThreads - maxCapacity, failureCount.get(), (totalThreads - maxCapacity) + " bookings must fail when capacity reached");
        assertEquals(maxCapacity, sharedSlot.getBookedCount(), "Slot bookedCount must be exactly equal to max capacity (" + maxCapacity + ")");
        assertEquals(maxCapacity, savedBookings.size(), "Total saved bookings must equal capacity");
    }
}
