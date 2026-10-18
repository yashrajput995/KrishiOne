package com.krishione.slotbooking;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.krishione.mandiprices.Mandi;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(
        name = "slots",
        indexes = {
                @Index(name = "idx_slots_lookup", columnList = "mandi_id, slot_type, slot_date")
        }
)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Slot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mandi_id", nullable = false)
    private Mandi mandi;

    @Enumerated(EnumType.STRING)
    @Column(name = "slot_type", nullable = false, length = 30)
    private SlotType slotType;

    @Column(name = "item_name", nullable = false, length = 100)
    private String itemName = "General";

    @Column(name = "slot_date", nullable = false)
    private LocalDate slotDate;

    @Column(name = "start_time", nullable = false, length = 20)
    private String startTime;

    @Column(name = "end_time", nullable = false, length = 20)
    private String endTime;

    @Column(name = "total_capacity", nullable = false)
    private int totalCapacity;

    @Column(name = "booked_count", nullable = false)
    private int bookedCount = 0;

    @Version
    @Column(name = "version", nullable = false)
    private Long version = 0L;

    public Slot() {}

    public Slot(Mandi mandi, SlotType slotType, String itemName, LocalDate slotDate, String startTime, String endTime, int totalCapacity) {
        this.mandi = mandi;
        this.slotType = slotType;
        this.itemName = itemName;
        this.slotDate = slotDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.totalCapacity = totalCapacity;
        this.bookedCount = 0;
        this.version = 0L;
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

    public int getTotalCapacity() {
        return totalCapacity;
    }

    public void setTotalCapacity(int totalCapacity) {
        this.totalCapacity = totalCapacity;
    }

    public int getBookedCount() {
        return bookedCount;
    }

    public void setBookedCount(int bookedCount) {
        this.bookedCount = bookedCount;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public int getAvailableCapacity() {
        return Math.max(0, totalCapacity - bookedCount);
    }

    public boolean isFull() {
        return bookedCount >= totalCapacity;
    }
}
