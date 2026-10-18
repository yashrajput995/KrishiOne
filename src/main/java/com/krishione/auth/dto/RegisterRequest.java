package com.krishione.auth.dto;

import com.krishione.auth.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class RegisterRequest {

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
    private String phone;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Name is required")
    private String name;

    private Role role = Role.FARMER;

    private String preferredLanguage = "hi";

    public RegisterRequest() {}

    public RegisterRequest(String phone, String password, String name, Role role, String preferredLanguage) {
        this.phone = phone;
        this.password = password;
        this.name = name;
        this.role = role != null ? role : Role.FARMER;
        this.preferredLanguage = preferredLanguage != null ? preferredLanguage : "hi";
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
