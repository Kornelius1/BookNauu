package com.reservation.business.dto.response;

import com.reservation.reservation.entity.ReservationStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalTime;

@Getter
@Builder
public class TodayReservationResponse {

    private Long id;

    private LocalTime startTime;

    private LocalTime endTime;

    private String customerName;

    private String resourceName;

    private ReservationStatus status;

    private BigDecimal totalPrice;
}