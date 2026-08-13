package com.reservation.business.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class DashboardSummaryResponse {

    private long totalReservations;

    private long todayReservations;

    private long totalCustomers;

    private BigDecimal reservationValue;

    private BigDecimal revenue;

    private long totalResources;
}