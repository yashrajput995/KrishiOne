package com.krishione.mandiprices;

import com.krishione.common.KrishiException;
import com.krishione.mandiprices.dto.MandiPriceDto;
import com.krishione.mandiprices.dto.PriceOverrideRequest;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MandiPriceService {

    private final MandiPriceRepository mandiPriceRepository;
    private final MandiRepository mandiRepository;
    private final CommodityRepository commodityRepository;

    public MandiPriceService(MandiPriceRepository mandiPriceRepository,
                             MandiRepository mandiRepository,
                             CommodityRepository commodityRepository) {
        this.mandiPriceRepository = mandiPriceRepository;
        this.mandiRepository = mandiRepository;
        this.commodityRepository = commodityRepository;
    }

    @Cacheable(value = "mandi_prices", key = "'search_' + (#query != null ? #query.toLowerCase() : 'all')")
    @Transactional(readOnly = true)
    public List<MandiPriceDto> searchPrices(String query) {
        List<MandiPrice> prices;
        if (query == null || query.trim().isEmpty()) {
            prices = mandiPriceRepository.findTop50ByOrderByArrivalDateDescModalPriceDesc();
        } else {
            prices = mandiPriceRepository.searchPrices(query.trim());
        }
        return prices.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MandiPriceDto> filterPrices(Long mandiId, Long commodityId, LocalDate arrivalDate) {
        return mandiPriceRepository.filterPrices(mandiId, commodityId, arrivalDate)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Mandi> getAllMandis() {
        return mandiRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Commodity> getAllCommodities() {
        return commodityRepository.findAll();
    }

    @Transactional
    @CacheEvict(value = "mandi_prices", allEntries = true)
    public MandiPriceDto overridePrice(PriceOverrideRequest request) {
        MandiPrice price = mandiPriceRepository.findById(request.getMandiPriceId())
                .orElseThrow(() -> new KrishiException("Mandi price record not found", HttpStatus.NOT_FOUND));

        price.setMinPrice(request.getMinPrice());
        price.setMaxPrice(request.getMaxPrice());
        price.setModalPrice(request.getModalPrice());
        price.setSource("ADMIN_OVERRIDE");
        price.setUpdatedAt(LocalDateTime.now());

        MandiPrice saved = mandiPriceRepository.save(price);
        return toDto(saved);
    }

    private MandiPriceDto toDto(MandiPrice entity) {
        MandiPriceDto dto = new MandiPriceDto();
        dto.setId(entity.getId());
        dto.setMandiId(entity.getMandi().getId());
        dto.setMandiName(entity.getMandi().getName());
        dto.setDistrict(entity.getMandi().getDistrict());
        dto.setState(entity.getMandi().getState());
        dto.setCommodityId(entity.getCommodity().getId());
        dto.setCommodityName(entity.getCommodity().getName());
        dto.setCommodityCategory(entity.getCommodity().getCategory());
        dto.setMinPrice(entity.getMinPrice());
        dto.setMaxPrice(entity.getMaxPrice());
        dto.setModalPrice(entity.getModalPrice());
        dto.setArrivalDate(entity.getArrivalDate());
        dto.setSource(entity.getSource());
        return dto;
    }
}
