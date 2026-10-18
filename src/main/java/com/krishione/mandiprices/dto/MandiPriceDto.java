package com.krishione.mandiprices.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

public class MandiPriceDto implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long id;
    private Long mandiId;
    private String mandiName;
    private String district;
    private String state;
    private Long commodityId;
    private String commodityName;
    private String commodityCategory;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private BigDecimal modalPrice;
    private LocalDate arrivalDate;
    private String source;

    public MandiPriceDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Long getCommodityId() {
        return commodityId;
    }

    public void setCommodityId(Long commodityId) {
        this.commodityId = commodityId;
    }

    public String getCommodityName() {
        return commodityName;
    }

    public void setCommodityName(String commodityName) {
        this.commodityName = commodityName;
    }

    public String getCommodityCategory() {
        return commodityCategory;
    }

    public void setCommodityCategory(String commodityCategory) {
        this.commodityCategory = commodityCategory;
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

    public LocalDate getArrivalDate() {
        return arrivalDate;
    }

    public void setArrivalDate(LocalDate arrivalDate) {
        this.arrivalDate = arrivalDate;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}
