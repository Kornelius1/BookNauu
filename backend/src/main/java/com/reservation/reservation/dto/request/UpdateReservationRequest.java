package com.reservation.reservation.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateReservationRequest {

    private Long resourceId;

    @FutureOrPresent
    private LocalDate reservationDate;
    private LocalTime startTime;
    private LocalTime endTime;

}