package com.krishione.mandiprices.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class PriceOverrideRequest {

    @NotNull(message = "Mandi price ID is required")
    private Long mandiPriceId;

    @NotNull(message = "Min price is required")
    @Positive(message = "Min price must be positive")
    private BigDecimal minPrice;

    @NotNull(message = "Max price is required")
    @Positive(message = "Max price must be positive")
    private BigDecimal maxPrice;

    @NotNull(message = "Modal price is required")
    @Positive(message = "Modal price must be positive")
    private BigDecimal modalPrice;

    public PriceOverrideRequest() {}

    public Long getMandiPriceId() {
        return mandiPriceId;
    }

    public void setMandiPriceId(Long mandiPriceId) {
        this.mandiPriceId = mandiPriceId;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }

    public BigDecimal getModalPrice() {
        return modalPrice;
    }

    public void setModalPrice(BigDecimal modalPrice) {
        this.modalPrice = modalPrice;
    }
}
