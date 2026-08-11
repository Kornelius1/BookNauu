package com.reservation.resource.repository;

import com.reservation.resource.entity.BookableResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookableResourceRepository
        extends JpaRepository<BookableResource, Long> {

    List<BookableResource> findByBusinessId(
            Long businessId
    );

    List<BookableResource> findByBusinessIdAndResourceTypeId(
            Long businessId,
            Long resourceTypeId
    );

    Optional<BookableResource> findByIdAndBusinessId(
            Long id,
            Long businessId
    );

    Optional<BookableResource>
    findByIdAndBusinessIdAndResourceTypeId(
            Long id,
            Long businessId,
            Long resourceTypeId
    );
}