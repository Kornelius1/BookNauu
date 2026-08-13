package com.reservation.business.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class BusinessDashboardResponse {

    private DashboardSummaryResponse summary;

    private List<RecentActivityResponse> recentActivities;

    private List<TodayReservationResponse> todayReservations;

    private List<ResourceAvailabilityResponse> resourceAvailability;
}