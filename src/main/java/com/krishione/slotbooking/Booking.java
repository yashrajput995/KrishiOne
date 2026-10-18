package com.krishione.slotbooking;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.krishione.auth.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "bookings",
        uniqueConstraints = {
                @UniqueConstraint(name = "unique_user_slot", columnNames = {"user_id", "slot_id"})
        },
        indexes = {
                @Index(name = "idx_bookings_user", columnList = "user_id")
        }
)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "slot_id", nullable = false)
    private Slot slot;

    @Column(name = "booking_code", nullable = false, unique = true, length = 50)
    private String bookingCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private BookingStatus status = BookingStatus.CONFIRMED;

    @Column(name = "booked_at")
    private LocalDateTime bookedAt = LocalDateTime.now();

    public Booking() {}

    public Booking(User user, Slot slot, String bookingCode, BookingStatus status) {
        this.user = user;
        this.slot = slot;
        this.bookingCode = bookingCode;
        this.status = status != null ? status : BookingStatus.CONFIRMED;
        this.bookedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Slot getSlot() {
        return slot;
    }

    public void setSlot(Slot slot) {
        this.slot = slot;
    }

    public String getBookingCode() {
        return bookingCode;
    }

    public void setBookingCode(String bookingCode) {
        this.bookingCode = bookingCode;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }

    public void setBookedAt(LocalDateTime bookedAt) {
        this.bookedAt = bookedAt;
    }
}
