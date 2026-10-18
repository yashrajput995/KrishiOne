package com.krishione.mandiprices;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mandis")
public class Mandi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String state = "Madhya Pradesh";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Mandi() {}

    public Mandi(String name, String district, String state) {
        this.name = name;
        this.district = district;
        this.state = state != null ? state : "Madhya Pradesh";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
