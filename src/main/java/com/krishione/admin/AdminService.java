package com.krishione.admin;

import com.krishione.admin.dto.AnalyticsSummaryDto;
import java.util.List;
import com.krishione.auth.UserRepository;
import com.krishione.mandiprices.CommodityRepository;
import com.krishione.mandiprices.MandiPriceService;
import com.krishione.mandiprices.MandiRepository;
import com.krishione.mandiprices.dto.MandiPriceDto;
import com.krishione.mandiprices.dto.PriceOverrideRequest;
import com.krishione.notifications.NotificationLogRepository;
import com.krishione.slotbooking.*;
import com.krishione.slotbooking.dto.CreateSlotRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final MandiRepository mandiRepository;
    private final CommodityRepository commodityRepository;
    private final SlotRepository slotRepository;
    private final BookingRepository bookingRepository;
    private final NotificationLogRepository notificationLogRepository;
    private final SlotBookingService slotBookingService;
    private final MandiPriceService mandiPriceService;

    public AdminService(UserRepository userRepository,
                        MandiRepository mandiRepository,
                        CommodityRepository commodityRepository,
                        SlotRepository slotRepository,
                        BookingRepository bookingRepository,
                        NotificationLogRepository notificationLogRepository,
                        SlotBookingService slotBookingService,
                        MandiPriceService mandiPriceService) {
        this.userRepository = userRepository;
        this.mandiRepository = mandiRepository;
        this.commodityRepository = commodityRepository;
        this.slotRepository = slotRepository;
        this.bookingRepository = bookingRepository;
        this.notificationLogRepository = notificationLogRepository;
        this.slotBookingService = slotBookingService;
        this.mandiPriceService = mandiPriceService;
    }

    @Transactional(readOnly = true)
    public AnalyticsSummaryDto getAnalytics() {
        AnalyticsSummaryDto dto = new AnalyticsSummaryDto();
        dto.setTotalUsers(userRepository.count());
        dto.setTotalMandis(mandiRepository.count());
        dto.setTotalCommodities(commodityRepository.count());
        dto.setTotalSlots(slotRepository.count());
        dto.setTotalConfirmedBookings(bookingRepository.countByStatus(BookingStatus.CONFIRMED));
        dto.setRecentSmsLogs(notificationLogRepository.findTop20ByOrderBySentAtDesc());
        List<com.krishione.slotbooking.dto.BookingResponse> recentResponses = bookingRepository.findTop50ByOrderByBookedAtDesc()
                .stream().map(b -> {
                    com.krishione.slotbooking.dto.BookingResponse r = new com.krishione.slotbooking.dto.BookingResponse();
                    r.setId(b.getId());
                    r.setBookingCode(b.getBookingCode());
                    r.setStatus(b.getStatus());
                    r.setBookedAt(b.getBookedAt());
                    if (b.getSlot() != null) {
                        r.setSlotId(b.getSlot().getId());
                        r.setSlotType(b.getSlot().getSlotType());
                        r.setItemName(b.getSlot().getItemName());
                        r.setSlotDate(b.getSlot().getSlotDate());
                        r.setStartTime(b.getSlot().getStartTime());
                        r.setEndTime(b.getSlot().getEndTime());
                        if (b.getSlot().getMandi() != null) {
                            r.setMandiId(b.getSlot().getMandi().getId());
                            r.setMandiName(b.getSlot().getMandi().getName());
                            r.setMandiDistrict(b.getSlot().getMandi().getDistrict());
                        }
                    }
                    if (b.getUser() != null) {
                        r.setFarmerName(b.getUser().getName());
                        r.setFarmerPhone(b.getUser().getPhone());
                    }
                    return r;
                }).toList();
        dto.setRecentBookings(recentResponses);
        return dto;
    }

    public Slot createSlot(CreateSlotRequest request) {
        return slotBookingService.createSlot(request);
    }

    public MandiPriceDto overridePrice(PriceOverrideRequest request) {
        return mandiPriceService.overridePrice(request);
    }
}
