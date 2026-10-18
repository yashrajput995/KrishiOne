package com.krishione.mandiprices;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MandiRepository extends JpaRepository<Mandi, Long> {
    Optional<Mandi> findByNameContainingIgnoreCase(String name);
    Optional<Mandi> findByDistrictIgnoreCase(String district);
}
