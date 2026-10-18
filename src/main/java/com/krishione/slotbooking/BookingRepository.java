package com.krishione.slotbooking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    boolean existsByUserIdAndSlotIdAndStatus(Long userId, Long slotId, BookingStatus status);
    List<Booking> findByUserIdOrderByBookedAtDesc(Long userId);
    Optional<Booking> findByBookingCode(String bookingCode);
    List<Booking> findTop50ByOrderByBookedAtDesc();
    long countByStatus(BookingStatus status);
}
