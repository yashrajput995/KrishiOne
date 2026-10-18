package com.krishione.mandiprices;

import com.krishione.common.ApiResponse;
import com.krishione.mandiprices.dto.MandiPriceDto;
import com.krishione.mandiprices.sync.DataGovInSyncJob;
import com.krishione.mandiprices.sync.EAnugyaSyncJob;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mandiprices")
public class MandiPriceController {

    private final MandiPriceService mandiPriceService;
    private final EAnugyaSyncJob eAnugyaSyncJob;
    private final DataGovInSyncJob dataGovInSyncJob;

    public MandiPriceController(MandiPriceService mandiPriceService,
                                EAnugyaSyncJob eAnugyaSyncJob,
                                DataGovInSyncJob dataGovInSyncJob) {
        this.mandiPriceService = mandiPriceService;
        this.eAnugyaSyncJob = eAnugyaSyncJob;
        this.dataGovInSyncJob = dataGovInSyncJob;
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<MandiPriceDto>>> searchPrices(
            @RequestParam(value = "q", required = false) String query) {
        List<MandiPriceDto> results = mandiPriceService.searchPrices(query);
        return ResponseEntity.ok(ApiResponse.ok("Mandi prices retrieved", results));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<MandiPriceDto>>> filterPrices(
            @RequestParam(value = "mandiId", required = false) Long mandiId,
            @RequestParam(value = "commodityId", required = false) Long commodityId,
            @RequestParam(value = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<MandiPriceDto> results = mandiPriceService.filterPrices(mandiId, commodityId, date);
        return ResponseEntity.ok(ApiResponse.ok("Filtered prices retrieved", results));
    }

    @GetMapping("/mandis")
    public ResponseEntity<ApiResponse<List<Mandi>>> getAllMandis() {
        return ResponseEntity.ok(ApiResponse.ok(mandiPriceService.getAllMandis()));
    }

    @GetMapping("/commodities")
    public ResponseEntity<ApiResponse<List<Commodity>>> getAllCommodities() {
        return ResponseEntity.ok(ApiResponse.ok(mandiPriceService.getAllCommodities()));
    }

    @PostMapping("/sync-eanugya")
    public ResponseEntity<ApiResponse<Map<String, Object>>> syncEAnugya() {
        int count = eAnugyaSyncJob.syncEAnugyaRates();
        return ResponseEntity.ok(ApiResponse.ok("MP e-Anugya Mandi rate sync completed",
                Map.of("syncedRecords", count, "source", "https://eanugya.mp.gov.in/Inward_Quote.aspx")));
    }

    @PostMapping("/sync")
    public ResponseEntity<ApiResponse<Map<String, Object>>> syncDataGov() {
        int count = dataGovInSyncJob.syncDailyMandiPrices();
        return ResponseEntity.ok(ApiResponse.ok("Data.gov.in Mandi price sync completed",
                Map.of("syncedRecords", count, "source", "data.gov.in Agmarknet API")));
    }
}
