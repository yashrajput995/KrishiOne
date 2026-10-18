package com.krishione.admin.dto;

import com.krishione.notifications.NotificationLog;
import com.krishione.slotbooking.dto.BookingResponse;

import java.util.List;

public class AnalyticsSummaryDto {
    private long totalUsers;
    private long totalMandis;
    private long totalCommodities;
    private long totalSlots;
    private long totalConfirmedBookings;
    private List<NotificationLog> recentSmsLogs;
    private List<BookingResponse> recentBookings;

    public AnalyticsSummaryDto() {}

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalMandis() {
        return totalMandis;
    }

    public void setTotalMandis(long totalMandis) {
        this.totalMandis = totalMandis;
    }

    public long getTotalCommodities() {
        return totalCommodities;
    }

    public void setTotalCommodities(long totalCommodities) {
        this.totalCommodities = totalCommodities;
    }

    public long getTotalSlots() {
        return totalSlots;
    }

    public void setTotalSlots(long totalSlots) {
        this.totalSlots = totalSlots;
    }

    public long getTotalConfirmedBookings() {
        return totalConfirmedBookings;
    }

    public void setTotalConfirmedBookings(long totalConfirmedBookings) {
        this.totalConfirmedBookings = totalConfirmedBookings;
    }

    public List<NotificationLog> getRecentSmsLogs() {
        return recentSmsLogs;
    }

    public void setRecentSmsLogs(List<NotificationLog> recentSmsLogs) {
        this.recentSmsLogs = recentSmsLogs;
    }

    public List<BookingResponse> getRecentBookings() {
        return recentBookings;
    }

    public void setRecentBookings(List<BookingResponse> recentBookings) {
        this.recentBookings = recentBookings;
    }
}
