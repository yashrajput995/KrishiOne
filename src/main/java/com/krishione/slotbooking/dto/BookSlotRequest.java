package com.krishione.slotbooking.dto;

import jakarta.validation.constraints.NotNull;

public class BookSlotRequest {

    @NotNull(message = "Slot ID is required")
    private Long slotId;

    public BookSlotRequest() {}

    public BookSlotRequest(Long slotId) {
        this.slotId = slotId;
    }

    public Long getSlotId() {
        return slotId;
    }

    public void setSlotId(Long slotId) {
        this.slotId = slotId;
    }
}
