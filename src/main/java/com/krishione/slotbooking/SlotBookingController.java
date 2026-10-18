package com.krishione.slotbooking;

import com.krishione.auth.security.JwtUtils;
import com.krishione.common.ApiResponse;
import com.krishione.slotbooking.dto.BookSlotRequest;
import com.krishione.slotbooking.dto.BookingResponse;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
public class SlotBookingController {

    private final SlotBookingService slotBookingService;
    private final JwtUtils jwtUtils;

    public SlotBookingController(SlotBookingService slotBookingService, JwtUtils jwtUtils) {
        this.slotBookingService = slotBookingService;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Slot>>> getSlots(
            @RequestParam(value = "mandiId", required = false) Long mandiId,
            @RequestParam(value = "type", required = false) SlotType type,
            @RequestParam(value = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Slot> slots = slotBookingService.getAvailableSlots(mandiId, type, date);
        return ResponseEntity.ok(ApiResponse.ok("Slots retrieved", slots));
    }

    @PostMapping("/book")
    public ResponseEntity<ApiResponse<BookingResponse>> bookSlot(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody BookSlotRequest request) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtils.getUserIdFromToken(token);

        BookingResponse response = slotBookingService.bookSlot(userId, request.getSlotId());
        return ResponseEntity.ok(ApiResponse.ok("Token reserved successfully! SMS dispatched.", response));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtils.getUserIdFromToken(token);

        List<BookingResponse> bookings = slotBookingService.getUserBookings(userId);
        return ResponseEntity.ok(ApiResponse.ok("My bookings retrieved", bookings));
    }

    @PostMapping("/cancel/{bookingId}")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long bookingId) {
        String token = authHeader.replace("Bearer ", "");
        Long userId = jwtUtils.getUserIdFromToken(token);

        slotBookingService.cancelBooking(userId, bookingId);
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled successfully", null));
    }
}
