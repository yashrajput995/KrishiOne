package com.krishione.mandiprices;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MandiPriceRepository extends JpaRepository<MandiPrice, Long> {

    Optional<MandiPrice> findByMandiIdAndCommodityIdAndArrivalDate(Long mandiId, Long commodityId, LocalDate arrivalDate);

    List<MandiPrice> findByArrivalDate(LocalDate arrivalDate);

    @Query("SELECT p FROM MandiPrice p " +
           "WHERE LOWER(p.mandi.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "   OR LOWER(p.mandi.district) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "   OR LOWER(p.commodity.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY p.arrivalDate DESC, p.mandi.name ASC")
    List<MandiPrice> searchPrices(@Param("query") String query);

    @Query("SELECT p FROM MandiPrice p " +
           "WHERE (:mandiId IS NULL OR p.mandi.id = :mandiId) " +
           "  AND (:commodityId IS NULL OR p.commodity.id = :commodityId) " +
           "  AND (:arrivalDate IS NULL OR p.arrivalDate = :arrivalDate) " +
           "ORDER BY p.arrivalDate DESC, p.modalPrice DESC")
    List<MandiPrice> filterPrices(@Param("mandiId") Long mandiId,
                                 @Param("commodityId") Long commodityId,
                                 @Param("arrivalDate") LocalDate arrivalDate);

    List<MandiPrice> findTop50ByOrderByArrivalDateDescModalPriceDesc();
}
