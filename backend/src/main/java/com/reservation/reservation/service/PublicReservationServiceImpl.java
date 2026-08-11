package com.reservation.reservation.service;

import com.reservation.business.entity.Business;
import com.reservation.business.repository.BusinessRepository;
import com.reservation.customer.entity.Customer;
import com.reservation.customer.service.CustomerService;
import com.reservation.common.exception.ResourceNotFoundException;
import com.reservation.reservation.dto.request.CreatePublicReservationRequest;
import com.reservation.reservation.dto.response.ReservationResponse;
import com.reservation.reservation.entity.Reservation;
import com.reservation.reservation.entity.ReservationStatus;
import com.reservation.reservation.mapper.ReservationMapper;
import com.reservation.reservation.repository.ReservationRepository;
import com.reservation.resource.entity.BookableResource;
import com.reservation.resource.entity.ResourceStatus;
import com.reservation.resource.repository.BookableResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class PublicReservationServiceImpl
        implements PublicReservationService {


    private final BusinessRepository businessRepository;
    private final BookableResourceRepository resourceRepository;
    private final ReservationRepository reservationRepository;
    private final CustomerService customerService;
    private final ReservationMapper reservationMapper;

    @Override
    @Transactional
    public ReservationResponse create(
            String businessSlug,
            CreatePublicReservationRequest request
    ) {

        /*
         * 1. Cari business berdasarkan slug.
         */
        Business business =
                businessRepository
                        .findBySlug(businessSlug)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Business",
                                        "slug",
                                        businessSlug
                                )
                        );

        /*
         * 2. Cari resource.
         *
         * Resource harus benar-benar milik
         * business dari URL.
         */
        BookableResource resource =
                resourceRepository
                        .findByIdAndBusinessId(
                                request.getResourceId(),
                                business.getId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Resource",
                                        "id",
                                        request.getResourceId()
                                )
                        );

        /*
         * 3. Resource harus AVAILABLE.
         */
        if (resource.getStatus() != ResourceStatus.AVAILABLE) {
            throw new IllegalStateException(
                    "Resource is not available for reservation."
            );
        }

        /*
         * 4. Validasi waktu.
         */
        validateReservationTime(
                request.getStartTime(),
                request.getEndTime()
        );

        validateBusinessHours(
                request.getStartTime(),
                request.getEndTime()
        );

        /*
         * 5. Cek konflik reservation.
         */
        boolean conflict =
                reservationRepository
                        .existsByBusinessIdAndResourceAndReservationDateAndStartTimeLessThanAndEndTimeGreaterThan(
                                business.getId(),
                                resource,
                                request.getReservationDate(),
                                request.getEndTime(),
                                request.getStartTime()
                        );

        if (conflict) {
            throw new IllegalStateException(
                    "Resource is already reserved for the selected time."
            );
        }

        /*
         * 6. Cari atau buat customer.
         *
         * Customer tidak membutuhkan login.
         */
        Customer customer =
                customerService.findOrCreate(
                        business,
                        request.getCustomer()
                );

        /*
         * 7. Buat reservation.
         */
        Reservation reservation =
                reservationMapper.toEntity(
                        new com.reservation.reservation.dto.request.CreateReservationRequest()
                );

        reservation.setReservationDate(
                request.getReservationDate()
        );

        reservation.setStartTime(
                request.getStartTime()
        );

        reservation.setEndTime(
                request.getEndTime()
        );

        reservation.setBusiness(business);
        reservation.setResource(resource);
        reservation.setCustomer(customer);
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setNote(request.getNote());

        /*
         * 8. Hitung total harga.
         */
        long hours =
                Duration.between(
                        request.getStartTime(),
                        request.getEndTime()
                ).toHours();

        reservation.setTotalPrice(
                resource.getPrice()
                        .multiply(
                                BigDecimal.valueOf(hours)
                        )
        );

        /*
         * 9. Simpan.
         */
        reservation =
                reservationRepository.save(reservation);

        /*
         * 10. Response.
         */
        return reservationMapper.toResponse(
                reservation
        );
    }

    private void validateReservationTime(
            LocalTime startTime,
            LocalTime endTime
    ) {

        if (!startTime.isBefore(endTime)) {
            throw new IllegalArgumentException(
                    "Start time must be before end time."
            );
        }
    }

    private void validateBusinessHours(
            LocalTime startTime,
            LocalTime endTime
    ) {

        LocalTime openingTime =
                LocalTime.of(14, 0);

        LocalTime closingTime =
                LocalTime.of(22, 0);

        if (startTime.isBefore(openingTime)
                || endTime.isAfter(closingTime)) {

            throw new IllegalArgumentException(
                    "Reservation must be between 14:00 and 22:00."
            );
        }
    }


}
