package com.reservation.business.service;

import com.reservation.business.dto.response.BusinessDashboardResponse;
import com.reservation.business.dto.response.DashboardSummaryResponse;
import com.reservation.business.dto.response.RecentActivityResponse;
import com.reservation.business.dto.response.ResourceAvailabilityResponse;
import com.reservation.business.dto.response.TodayReservationResponse;
import com.reservation.reservation.entity.Reservation;
import com.reservation.reservation.entity.ReservationStatus;
import com.reservation.reservation.repository.ReservationRepository;
import com.reservation.resource.entity.BookableResource;
import com.reservation.resource.entity.ResourceStatus;
import com.reservation.resource.repository.BookableResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BusinessDashboardServiceImpl
        implements BusinessDashboardService {

    private final BusinessContextService businessContextService;
    private final ReservationRepository reservationRepository;
    private final BookableResourceRepository resourceRepository;

    @Override
    public BusinessDashboardResponse getDashboard() {

        Long businessId =
                businessContextService.getCurrentBusinessId();

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        /*
         * =========================================
         * RESERVATIONS
         * =========================================
         */

        List<Reservation> reservations =
                reservationRepository.findByBusinessId(
                        businessId
                );

        List<Reservation> todayReservations =
                reservations.stream()
                        .filter(reservation ->
                                today.equals(
                                        reservation.getReservationDate()
                                )
                        )
                        .filter(reservation ->
                                reservation.getStatus() != ReservationStatus.CANCELLED
                        )
                        .toList();

        /*
         * =========================================
         * CUSTOMERS
         * =========================================
         */

        Set<Long> customerIds =
                reservations.stream()
                        .map(Reservation::getCustomer)
                        .filter(customer -> customer != null)
                        .map(customer -> customer.getId())
                        .collect(java.util.stream.Collectors.toSet());

        /*
         * =========================================
         * RESERVATION VALUE
         * =========================================
         */

        BigDecimal reservationValue =
                reservations.stream()
                        .filter(reservation ->
                                reservation.getStatus() != ReservationStatus.CANCELLED
                        )
                        .map(Reservation::getTotalPrice)
                        .filter(price -> price != null)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        BigDecimal revenue =
                reservations.stream()
                        .filter(reservation ->
                                reservation.getStatus() == ReservationStatus.COMPLETED
                        )
                        .map(Reservation::getTotalPrice)
                        .filter(price -> price != null)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        /*
         * =========================================
         * RESOURCES
         * =========================================
         */

        List<BookableResource> resources =
                resourceRepository.findByBusinessId(
                        businessId
                );

        /*
         * =========================================
         * SUMMARY
         * =========================================
         */

        DashboardSummaryResponse summary =
                DashboardSummaryResponse.builder()
                        .totalReservations(
                                reservations.size()
                        )
                        .todayReservations(
                                todayReservations.size()
                        )
                        .totalCustomers(
                                customerIds.size()
                        )
                        .reservationValue(
                                reservationValue
                        )
                        .revenue(
                                revenue
                        )
                        .totalResources(
                                resources.size()
                        )
                        .build();

        /*
         * =========================================
         * RECENT ACTIVITIES
         * =========================================
         */

        List<RecentActivityResponse> recentActivities =
                reservations.stream()
                        .sorted(
                                Comparator.comparing(
                                        Reservation::getCreatedAt,
                                        Comparator.nullsLast(
                                                Comparator.reverseOrder()
                                        )
                                )
                        )
                        .limit(10)
                        .map(this::toRecentActivityResponse)
                        .toList();

        /*
         * =========================================
         * TODAY'S RESERVATIONS
         * =========================================
         */

        List<TodayReservationResponse> todayReservationResponses =
                todayReservations.stream()
                        .sorted(
                                Comparator.comparing(
                                        Reservation::getStartTime
                                )
                        )
                        .map(this::toTodayReservationResponse)
                        .toList();

        /*
         * =========================================
         * RESOURCE AVAILABILITY
         * =========================================
         */

        List<ResourceAvailabilityResponse> resourceAvailability =
                resources.stream()
                        .map(resource ->
                                toResourceAvailabilityResponse(
                                        resource,
                                        todayReservations,
                                        now
                                )
                        )
                        .toList();

        return BusinessDashboardResponse.builder()
                .summary(summary)
                .recentActivities(recentActivities)
                .todayReservations(
                        todayReservationResponses
                )
                .resourceAvailability(
                        resourceAvailability
                )
                .build();
    }

    private RecentActivityResponse toRecentActivityResponse(
            Reservation reservation
    ) {

        return RecentActivityResponse.builder()
                .reservationId(
                        reservation.getId()
                )
                .customerName(
                        reservation.getCustomer() != null
                                ? reservation.getCustomer().getFullName()
                                : null
                )
                .resourceName(
                        reservation.getResource() != null
                                ? reservation.getResource().getName()
                                : null
                )
                .status(
                        reservation.getStatus()
                )
                .totalPrice(
                        reservation.getTotalPrice()
                )
                .createdAt(
                        reservation.getCreatedAt()
                )
                .build();
    }

    private TodayReservationResponse toTodayReservationResponse(
            Reservation reservation
    ) {

        return TodayReservationResponse.builder()
                .id(
                        reservation.getId()
                )
                .startTime(
                        reservation.getStartTime()
                )
                .endTime(
                        reservation.getEndTime()
                )
                .customerName(
                        reservation.getCustomer() != null
                                ? reservation.getCustomer().getFullName()
                                : null
                )
                .resourceName(
                        reservation.getResource() != null
                                ? reservation.getResource().getName()
                                : null
                )
                .status(
                        reservation.getStatus()
                )
                .totalPrice(
                        reservation.getTotalPrice()
                )
                .build();
    }

    private ResourceAvailabilityResponse
    toResourceAvailabilityResponse(
            BookableResource resource,
            List<Reservation> todayReservations,
            LocalTime now
    ) {

        /*
         * Resource yang inactive tidak dianggap available.
         */
        if (resource.getStatus() != ResourceStatus.AVAILABLE) {

            return ResourceAvailabilityResponse.builder()
                    .resourceId(resource.getId())
                    .resourceName(resource.getName())
                    .status(resource.getStatus())
                    .available(false)
                    .build();
        }

        /*
         * Cek apakah resource sedang digunakan
         * oleh reservation yang berlangsung sekarang.
         */
        boolean currentlyReserved =
                todayReservations.stream()
                        .filter(reservation ->
                                reservation.getResource() != null
                                        && reservation.getResource()
                                        .getId()
                                        .equals(resource.getId())
                        )
                        .anyMatch(reservation -> {

                            LocalTime start =
                                    reservation.getStartTime();

                            LocalTime end =
                                    reservation.getEndTime();

                            return start != null
                                    && end != null
                                    && !now.isBefore(start)
                                    && now.isBefore(end);
                        });

        return ResourceAvailabilityResponse.builder()
                .resourceId(resource.getId())
                .resourceName(resource.getName())
                .status(resource.getStatus())
                .available(!currentlyReserved)
                .build();
    }
}