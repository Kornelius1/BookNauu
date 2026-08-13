package com.reservation.business.repository;

import com.reservation.business.entity.BusinessOperatingHours;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

public interface BusinessOperatingHoursRepository
        extends JpaRepository<BusinessOperatingHours, Long> {

    Optional<BusinessOperatingHours>
    findByBusinessIdAndDayOfWeek(
            Long businessId,
            DayOfWeek dayOfWeek
    );

    List<BusinessOperatingHours>
    findByBusinessIdOrderByDayOfWeek(
            Long businessId
    );
}