package com.reservation.business.dto.response;

import com.reservation.reservation.entity.ReservationStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class RecentActivityResponse {

    private Long reservationId;

    private String customerName;

    private String resourceName;

    private ReservationStatus status;

    private BigDecimal totalPrice;

    private LocalDateTime createdAt;
}