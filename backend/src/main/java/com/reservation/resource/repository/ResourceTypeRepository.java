package com.reservation.resource.repository;

import com.reservation.resource.entity.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResourceTypeRepository
        extends JpaRepository<ResourceType, Long> {

    List<ResourceType> findByBusinessId(Long businessId);

    Optional<ResourceType> findByIdAndBusinessId(
            Long id,
            Long businessId
    );

    boolean existsByBusinessIdAndName(
            Long businessId,
            String name
    );

    boolean existsByBusinessIdAndNameAndIdNot(
            Long businessId,
            String name,
            Long id
    );
}