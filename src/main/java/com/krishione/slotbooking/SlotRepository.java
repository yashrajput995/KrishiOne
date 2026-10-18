package com.krishione.slotbooking;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {

    /**
     * Acquires a database-level pessimistic write lock (SELECT ... FOR UPDATE)
     * preventing any concurrent transactions from modifying or reading dirty capacity.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Slot s WHERE s.id = :id")
    Optional<Slot> findByIdForUpdate(@Param("id") Long id);

    @Query("SELECT s FROM Slot s " +
           "WHERE (:mandiId IS NULL OR s.mandi.id = :mandiId) " +
           "  AND (:slotType IS NULL OR s.slotType = :slotType) " +
           "  AND ((:slotDate IS NOT NULL AND s.slotDate = :slotDate) OR (:slotDate IS NULL AND s.slotDate >= :minDate)) " +
           "ORDER BY s.slotDate ASC, s.startTime ASC")
    List<Slot> filterSlots(@Param("mandiId") Long mandiId,
                           @Param("slotType") SlotType slotType,
                           @Param("slotDate") LocalDate slotDate,
                           @Param("minDate") LocalDate minDate);

    List<Slot> findBySlotDateGreaterThanEqualOrderBySlotDateAsc(LocalDate date);
}
