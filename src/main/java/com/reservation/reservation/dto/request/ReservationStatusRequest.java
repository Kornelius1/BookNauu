package com.reservation.reservation.dto.request;

import com.reservation.reservation.entity.ReservationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReservationStatusRequest {

    @NotNull(message = "Status is required")
    private ReservationStatus status;

}