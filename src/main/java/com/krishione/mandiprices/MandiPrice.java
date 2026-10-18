package com.krishione.mandiprices;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "mandi_prices",
        uniqueConstraints = {
                @UniqueConstraint(name = "unique_mandi_commodity_date", columnNames = {"mandi_id", "commodity_id", "arrival_date"})
        },
        indexes = {
                @Index(name = "idx_mandi_prices_lookup", columnList = "mandi_id, commodity_id, arrival_date")
        }
)
public class MandiPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mandi_id", nullable = false)
    private Mandi mandi;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "commodity_id", nullable = false)
    private Commodity commodity;

    @Column(name = "min_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal minPrice;

    @Column(name = "max_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal maxPrice;

    @Column(name = "modal_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal modalPrice;

    @Column(name = "arrival_date", nullable = false)
    private LocalDate arrivalDate;

    @Column(length = 50)
    private String source = "MP_EANUGYA";

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public MandiPrice() {}

    public MandiPrice(Mandi mandi, Commodity commodity, BigDecimal minPrice, BigDecimal maxPrice, BigDecimal modalPrice, LocalDate arrivalDate, String source) {
        this.mandi = mandi;
        this.commodity = commodity;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.modalPrice = modalPrice;
        this.arrivalDate = arrivalDate;
        this.source = source != null ? source : "MP_EANUGYA";
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Mandi getMandi() {
        return mandi;
    }

    public void setMandi(Mandi mandi) {
        this.mandi = mandi;
    }

    public Commodity getCommodity() {
        return commodity;
    }

    public void setCommodity(Commodity commodity) {
        this.commodity = commodity;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
