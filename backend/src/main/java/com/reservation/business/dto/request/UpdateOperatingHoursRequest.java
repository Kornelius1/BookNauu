package com.reservation.business.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Getter
@Setter
public class UpdateOperatingHoursRequest {

    @NotNull(message = "Day of week is required")
    private DayOfWeek dayOfWeek;

    private LocalTime openTime;

    private LocalTime closeTime;

    @NotNull(message = "Closed status is required")
    private Boolean closed;
}