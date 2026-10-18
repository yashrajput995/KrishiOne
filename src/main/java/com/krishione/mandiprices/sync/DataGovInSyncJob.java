package com.krishione.mandiprices.sync;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.krishione.mandiprices.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

/**
 * Scheduled sync job pulling official Agmarknet mandi rates from data.gov.in
 */
@Component
public class DataGovInSyncJob {

    private static final Logger log = LoggerFactory.getLogger(DataGovInSyncJob.class);

    @Value("${datagov.api.url:https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070}")
    private String apiUrl;

    @Value("${datagov.api.key:579b464db66ec23bdd000001cdd394715a544b64700f71cae92b0000}")
    private String apiKey;

    @Value("${datagov.api.limit:100}")
    private int limit;

    private final MandiRepository mandiRepository;
    private final CommodityRepository commodityRepository;
    private final MandiPriceRepository mandiPriceRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public DataGovInSyncJob(MandiRepository mandiRepository,
                            CommodityRepository commodityRepository,
                            MandiPriceRepository mandiPriceRepository) {
        this.mandiRepository = mandiRepository;
        this.commodityRepository = commodityRepository;
        this.mandiPriceRepository = mandiPriceRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    @Scheduled(cron = "${datagov.sync.cron:0 0 6 * * ?}")
    @Transactional
    @CacheEvict(value = "mandi_prices", allEntries = true)
    public int syncDailyMandiPrices() {
        log.info("Starting scheduled data.gov.in mandi rate sync...");
        int synced = 0;

        try {
            String requestUrl = String.format("%s?api-key=%s&format=json&limit=%d&filters[state]=Madhya+Pradesh",
                    apiUrl, apiKey, limit);

            ResponseEntity<String> response = restTemplate.getForEntity(requestUrl, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode records = root.path("records");

                if (records.isArray() && records.size() > 0) {
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

                    for (JsonNode rec : records) {
                        String mandiName = rec.path("market").asText();
                        String district = rec.path("district").asText();
                        String state = rec.path("state").asText("Madhya Pradesh");
                        String commodityName = rec.path("commodity").asText();
                        double minVal = rec.path("min_price").asDouble();
                        double maxVal = rec.path("max_price").asDouble();
                        double modalVal = rec.path("modal_price").asDouble();
                        String arrivalDateStr = rec.path("arrival_date").asText();

                        LocalDate arrivalDate = LocalDate.now();
                        try {
                            arrivalDate = LocalDate.parse(arrivalDateStr, formatter);
                        } catch (Exception ex) {
                            // Fallback to today if format differs
                        }

                        if (!mandiName.isEmpty() && !commodityName.isEmpty() && modalVal > 0) {
                            Mandi mandi = mandiRepository.findByNameContainingIgnoreCase(mandiName)
                                    .orElseGet(() -> mandiRepository.save(new Mandi(mandiName, district, state)));

                            Commodity commodity = commodityRepository.findByNameContainingIgnoreCase(commodityName)
                                    .orElseGet(() -> commodityRepository.save(new Commodity(commodityName, "Agriculture")));

                            Optional<MandiPrice> existing = mandiPriceRepository.findByMandiIdAndCommodityIdAndArrivalDate(
                                    mandi.getId(), commodity.getId(), arrivalDate);

                            if (existing.isPresent()) {
                                MandiPrice p = existing.get();
                                p.setMinPrice(BigDecimal.valueOf(minVal));
                                p.setMaxPrice(BigDecimal.valueOf(maxVal));
                                p.setModalPrice(BigDecimal.valueOf(modalVal));
                                p.setSource("DATA_GOV_IN");
                                mandiPriceRepository.save(p);
                            } else {
                                MandiPrice p = new MandiPrice(mandi, commodity,
                                        BigDecimal.valueOf(minVal),
                                        BigDecimal.valueOf(maxVal),
                                        BigDecimal.valueOf(modalVal),
                                        arrivalDate,
                                        "DATA_GOV_IN");
                                mandiPriceRepository.save(p);
                            }
                            synced++;
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.warn("data.gov.in API sync notice: {}. Continuing with existing verified database rates.", e.getMessage());
        }

        log.info("data.gov.in sync finished. Synced records: {}", synced);
        return synced;
    }
}
