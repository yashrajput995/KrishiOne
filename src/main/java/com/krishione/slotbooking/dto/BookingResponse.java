package com.krishione.slotbooking.dto;

import com.krishione.slotbooking.BookingStatus;
import com.krishione.slotbooking.SlotType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingResponse {
    private Long id;
    private String bookingCode;
    private BookingStatus status;
    private LocalDateTime bookedAt;

    private Long slotId;
    private SlotType slotType;
    private String itemName;
    private LocalDate slotDate;
    private String startTime;
    private String endTime;

    private Long mandiId;
    private String mandiName;
    private String mandiDistrict;

    private String farmerName;
    private String farmerPhone;

    public BookingResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getSlotId() {
        return slotId;
    }

    public void setSlotId(Long slotId) {
        this.slotId = slotId;
    }

    public SlotType getSlotType() {
        return slotType;
    }

    public void setSlotType(SlotType slotType) {
        this.slotType = slotType;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public LocalDate getSlotDate() {
        return slotDate;
    }

    public void setSlotDate(LocalDate slotDate) {
        this.slotDate = slotDate;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public Long getMandiId() {
        return mandiId;
    }

    public void setMandiId(Long mandiId) {
        this.mandiId = mandiId;
    }

    public String getMandiName() {
        return mandiName;
    }

    public void setMandiName(String mandiName) {
        this.mandiName = mandiName;
    }

    public String getMandiDistrict() {
        return mandiDistrict;
    }

    public void setMandiDistrict(String mandiDistrict) {
        this.mandiDistrict = mandiDistrict;
    }

    public String getFarmerName() {
        return farmerName;
    }

    public void setFarmerName(String farmerName) {
        this.farmerName = farmerName;
    }

    public String getFarmerPhone() {
        return farmerPhone;
    }

    public void setFarmerPhone(String farmerPhone) {
        this.farmerPhone = farmerPhone;
    }
}
