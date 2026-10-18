package com.krishione.admin;

import com.krishione.admin.dto.AnalyticsSummaryDto;
import com.krishione.common.ApiResponse;
import com.krishione.mandiprices.dto.MandiPriceDto;
import com.krishione.mandiprices.dto.PriceOverrideRequest;
import com.krishione.slotbooking.Slot;
import com.krishione.slotbooking.dto.CreateSlotRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('MANDI_ADMIN', 'SUPER_ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AnalyticsSummaryDto>> getAnalytics() {
        AnalyticsSummaryDto summary = adminService.getAnalytics();
        return ResponseEntity.ok(ApiResponse.ok("System analytics retrieved", summary));
    }

    @PostMapping("/slots")
    public ResponseEntity<ApiResponse<Slot>> createSlot(@Valid @RequestBody CreateSlotRequest request) {
        Slot created = adminService.createSlot(request);
        return ResponseEntity.ok(ApiResponse.ok("Slot provisioned successfully", created));
    }

    @PutMapping("/prices")
    public ResponseEntity<ApiResponse<MandiPriceDto>> overridePrice(@Valid @RequestBody PriceOverrideRequest request) {
        MandiPriceDto updated = adminService.overridePrice(request);
        return ResponseEntity.ok(ApiResponse.ok("Emergency price override applied and cache evicted", updated));
    }
}
