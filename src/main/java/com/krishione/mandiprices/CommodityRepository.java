package com.krishione.mandiprices;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommodityRepository extends JpaRepository<Commodity, Long> {
    Optional<Commodity> findByName(String name);
    Optional<Commodity> findByNameContainingIgnoreCase(String name);
}
