package com.reservation.reservation.service;

import com.reservation.auth.entity.User;
import com.reservation.auth.repository.UserRepository;
import com.reservation.auth.service.AuthService;
import com.reservation.business.entity.Business;
import com.reservation.business.entity.BusinessOperatingHours;
import com.reservation.business.repository.BusinessOperatingHoursRepository;
import com.reservation.resource.entity.ResourceStatus;
import com.reservation.business.service.BusinessMembershipService;
import com.reservation.common.exception.ResourceNotFoundException;
import com.reservation.common.exception.RoomUnavailableException;
import com.reservation.reservation.dto.request.CreateReservationRequest;
import com.reservation.reservation.dto.request.ReservationStatusRequest;
import com.reservation.reservation.dto.request.UpdateReservationRequest;
import com.reservation.reservation.dto.response.ReservationResponse;
import com.reservation.reservation.entity.Reservation;
import com.reservation.reservation.entity.ReservationStatus;
import com.reservation.reservation.mapper.ReservationMapper;
import com.reservation.reservation.repository.ReservationRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;
import com.reservation.business.service.BusinessContextService;
import com.reservation.resource.entity.BookableResource;
import com.reservation.resource.repository.BookableResourceRepository;
import com.reservation.customer.entity.Customer;
import com.reservation.customer.service.CustomerService;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final ReservationMapper reservationMapper;
    private final AuthService authService;
    private final BusinessContextService businessContextService;
    private final BusinessMembershipService businessMembershipService;
    private final BookableResourceRepository resourceRepository;
    private final CustomerService customerService;
    private final BusinessOperatingHoursRepository businessOperatingHoursRepository;



    @Override
    @Transactional
    public ReservationResponse create(
            CreateReservationRequest request
    ) {

        Long businessId =
                businessContextService.getCurrentBusinessId();

        Customer customer =
                customerService.findOrCreate(
                        businessContextService.getCurrentBusiness(),
                        request.getCustomer()
                );

        BookableResource resource =
                resourceRepository
                        .findByIdAndBusinessId(
                                request.getResourceId(),
                                businessId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Resource",
                                        "id",
                                        request.getResourceId()
                                )
                        );

        if (resource.getStatus() != ResourceStatus.AVAILABLE) {
            throw new RoomUnavailableException(
                    "Resource is not available for reservation."
            );
        }

        validateReservationTime(
                request.getStartTime(),
                request.getEndTime()
        );

        validateBusinessHours(
                businessId,
                request.getReservationDate(),
                request.getStartTime(),
                request.getEndTime()
        );

        validateReservationConflict(
                businessId,
                resource,
                request.getReservationDate(),
                request.getStartTime(),
                request.getEndTime()
        );

        Reservation reservation =
                reservationMapper.toEntity(request);

        reservation.setBusiness(
                businessContextService.getCurrentBusiness()
        );

        reservation.setCustomer(customer);
        reservation.setResource(resource);
        reservation.setStatus(ReservationStatus.PENDING);

        long hours =
                Duration.between(
                        request.getStartTime(),
                        request.getEndTime()
                ).toHours();

        reservation.setTotalPrice(
                resource.getPrice()
                        .multiply(BigDecimal.valueOf(hours))
        );

        reservation =
                reservationRepository.save(reservation);

        return reservationMapper.toResponse(reservation);
    }


    @Override
    @Transactional
    public ReservationResponse update(
            Long id,
            UpdateReservationRequest request
    ) {

        Long businessId =
                businessContextService.getCurrentBusinessId();

        Reservation reservation =
                reservationRepository
                        .findByIdAndBusinessId(
                                id,
                                businessId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Reservation",
                                        "id",
                                        id
                                )
                        );

        BookableResource resource =
                reservation.getResource();

        if (request.getResourceId() != null &&
                !request.getResourceId()
                        .equals(resource.getId())) {

            resource =
                    resourceRepository
                            .findByIdAndBusinessId(
                                    request.getResourceId(),
                                    businessId
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Resource",
                                            "id",
                                            request.getResourceId()
                                    )
                            );
        }

        LocalDate reservationDate =
                request.getReservationDate() != null
                        ? request.getReservationDate()
                        : reservation.getReservationDate();

        LocalTime startTime =
                request.getStartTime() != null
                        ? request.getStartTime()
                        : reservation.getStartTime();

        LocalTime endTime =
                request.getEndTime() != null
                        ? request.getEndTime()
                        : reservation.getEndTime();

        validateReservationTime(
                startTime,
                endTime
        );

        validateBusinessHours(
                businessId,
                reservationDate,
                startTime,
                endTime
        );

        validateReservationConflict(
                reservation.getId(),
                businessId,
                resource,
                reservationDate,
                startTime,
                endTime
        );

        reservationMapper.updateEntity(
                request,
                reservation
        );

        reservation.setResource(resource);

        long hours =
                Duration.between(
                        startTime,
                        endTime
                ).toHours();

        reservation.setTotalPrice(
                resource.getPrice()
                        .multiply(BigDecimal.valueOf(hours))
        );

        reservation =
                reservationRepository.save(reservation);

        return reservationMapper.toResponse(reservation);
    }

    @Override
    @Transactional(readOnly = true)
    public ReservationResponse getById(Long id) {

        Long businessId =
                businessContextService.getCurrentBusinessId();

        Reservation reservation =
                reservationRepository
                        .findByIdAndBusinessId(
                                id,
                                businessId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Reservation",
                                        "id",
                                        id
                                )
                        );

        return reservationMapper.toResponse(
                reservation
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationResponse> getAll() {

        Long businessId =
                businessContextService.getCurrentBusinessId();

        return reservationRepository
                .findByBusinessId(businessId)
                .stream()
                .map(reservationMapper::toResponse)
                .toList();
    }

    @Override
    public List<ReservationResponse> getMyReservations() {

        User user = getCurrentUser();


        Long businessId =
                businessContextService.getCurrentBusinessId();

        return reservationRepository
                .findByBusinessIdAndCustomer(businessId, user)
                .stream()
                .map(reservationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public ReservationResponse updateStatus(
            Long id,
            ReservationStatusRequest request
    ) {

        businessMembershipService.requireOwnerOrAdmin();

        Long businessId =
                businessContextService.getCurrentBusinessId();

        Reservation reservation =
                reservationRepository
                        .findByIdAndBusinessId(
                                id,
                                businessId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Reservation",
                                        "id",
                                        id
                                )
                        );

        reservation.setStatus(request.getStatus());

        reservation =
                reservationRepository.save(reservation);

        return reservationMapper.toResponse(reservation);
    }

    @Override
    @Transactional
    public void delete(Long id) {

        businessMembershipService.requireOwnerOrAdmin();

        Long businessId =
                businessContextService.getCurrentBusinessId();

        Reservation reservation =
                reservationRepository
                        .findByIdAndBusinessId(
                                id,
                                businessId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Reservation",
                                        "id",
                                        id
                                )
                        );

        reservationRepository.delete(reservation);
    }

    /**
     * Ambil user yang sedang login
     */
    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User",
                                "email",
                                email));
    }

    private void validateReservationAccess(
            Reservation reservation
    ) {

        Business currentBusiness =
                businessContextService
                        .getCurrentBusiness();


        if (!reservation.getBusiness()
                .getId()
                .equals(currentBusiness.getId())) {

            throw new AccessDeniedException(
                    "You do not have access to this reservation"
            );
        }
    }


    private void validateReservationTime(
            LocalTime startTime,
            LocalTime endTime
    ) {

        if (!endTime.isAfter(startTime)) {
            throw new IllegalArgumentException(
                    "End time must be after start time."
            );
        }
    }

    private void validateBusinessHours(
            Long businessId,
            LocalDate reservationDate,
            LocalTime startTime,
            LocalTime endTime
    ) {

        DayOfWeek dayOfWeek =
                reservationDate.getDayOfWeek();

        BusinessOperatingHours operatingHours =
                businessOperatingHoursRepository
                        .findByBusinessIdAndDayOfWeek(
                                businessId,
                                dayOfWeek
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Business operating hours "
                                                + "are not configured."
                                )
                        );

        if (operatingHours.isClosed()) {

            throw new IllegalArgumentException(
                    "Business is closed on "
                            + dayOfWeek
            );
        }

        LocalTime openTime =
                operatingHours.getOpenTime();

        LocalTime closeTime =
                operatingHours.getCloseTime();

        if (openTime == null || closeTime == null) {

            throw new IllegalArgumentException(
                    "Business operating hours are invalid."
            );
        }

        if (startTime.isBefore(openTime)
                || endTime.isAfter(closeTime)) {

            throw new IllegalArgumentException(
                    "Reservation time is outside "
                            + "business hours."
            );
        }
    }

    private void validateReservationConflict(
            Long businessId,
            BookableResource resource,
            LocalDate reservationDate,
            LocalTime startTime,
            LocalTime endTime
    ) {

        boolean conflict =
                reservationRepository
                        .existsByBusinessIdAndResourceAndReservationDateAndStartTimeLessThanAndEndTimeGreaterThan(
                                businessId,
                                resource,
                                reservationDate,
                                endTime,
                                startTime
                        );

        if (conflict) {
            throw new IllegalArgumentException(
                    "Resource is already reserved for the selected time."
            );
        }
    }

    private void validateReservationConflict(
            Long reservationId,
            Long businessId,
            BookableResource resource,
            LocalDate reservationDate,
            LocalTime startTime,
            LocalTime endTime
    ) {

        boolean conflict =
                reservationRepository
                        .existsByBusinessIdAndResourceAndReservationDateAndStartTimeLessThanAndEndTimeGreaterThanAndIdNot(
                                businessId,
                                resource,
                                reservationDate,
                                endTime,
                                startTime,
                                reservationId
                        );

        if (conflict) {
            throw new IllegalArgumentException(
                    "Resource is already reserved for the selected time."
            );
        }
    }
}