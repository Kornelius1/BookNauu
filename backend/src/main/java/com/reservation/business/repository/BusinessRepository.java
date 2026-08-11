package com.reservation.business.repository;

import com.reservation.business.entity.Business;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BusinessRepository
        extends JpaRepository<Business, Long> {

    Optional<Business> findBySlug(String slug);

    boolean existsBySlug(String slug);
}