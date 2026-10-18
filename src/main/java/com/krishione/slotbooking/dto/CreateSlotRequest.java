package com.krishione.slotbooking.dto;

import com.krishione.slotbooking.SlotType;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public class CreateSlotRequest {

    @NotNull(message = "Mandi ID is required")
    private Long mandiId;

    @NotNull(message = "Slot type is required")
    private SlotType slotType;

    @NotBlank(message = "Item name is required")
    private String itemName;

    @NotNull(message = "Slot date is required")
    @FutureOrPresent(message = "Slot date must be today or in the future")
    private LocalDate slotDate;

    @NotBlank(message = "Start time is required")
    private String startTime;

    @NotBlank(message = "End time is required")
    private String endTime;

    @NotNull(message = "Total capacity is required")
    @Positive(message = "Capacity must be positive")
    private Integer totalCapacity;

    public CreateSlotRequest() {}

    public Long getMandiId() {
        return mandiId;
    }

    public void setMandiId(Long mandiId) {
        this.mandiId = mandiId;
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

    public Integer getTotalCapacity() {
        return totalCapacity;
    }

    public void setTotalCapacity(Integer totalCapacity) {
        this.totalCapacity = totalCapacity;
    }
}
