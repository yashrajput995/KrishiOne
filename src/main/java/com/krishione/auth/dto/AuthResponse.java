package com.krishione.auth.dto;

import com.krishione.auth.Role;

public class AuthResponse {
    private String token;
    private Long userId;
    private String phone;
    private String name;
    private Role role;
    private String preferredLanguage;

    public AuthResponse() {}

    public AuthResponse(String token, Long userId, String phone, String name, Role role, String preferredLanguage) {
        this.token = token;
        this.userId = userId;
        this.phone = phone;
        this.name = name;
        this.role = role;
        this.preferredLanguage = preferredLanguage;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getPreferredLanguage() {
        return preferredLanguage;
    }

    public void setPreferredLanguage(String preferredLanguage) {
        this.preferredLanguage = preferredLanguage;
    }
}
