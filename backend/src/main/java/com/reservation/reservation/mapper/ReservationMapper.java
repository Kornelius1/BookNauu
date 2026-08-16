package com.reservation.reservation.mapper;

import com.reservation.reservation.dto.request.CreateReservationRequest;
import com.reservation.reservation.dto.request.CreatePublicReservationRequest;
import com.reservation.reservation.dto.request.UpdateReservationRequest;
import com.reservation.reservation.dto.response.ReservationResponse;
import com.reservation.reservation.entity.Reservation;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {

    public Reservation toEntity(
            CreatePublicReservationRequest request
    ) {

        if (request == null) {
            return null;
        }

        return Reservation.builder()
                .reservationDate(request.getReservationDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .note(request.getNote())
                .build();

    }

    public Reservation toEntity(CreateReservationRequest request) {

        if (request == null) {
            return null;
        }

        return Reservation.builder()
                .reservationDate(request.getReservationDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();
    }

    public ReservationResponse toResponse(
            Reservation reservation
    ) {

        if (reservation == null) {
            return null;
        }

        return ReservationResponse.builder()
                .id(reservation.getId())

                .customerId(
                        reservation.getCustomer().getId()
                )
                .customerName(
                        reservation.getCustomer().getFullName()
                )

                .resourceId(
                        reservation.getResource().getId()
                )
                .resourceName(
                        reservation.getResource().getName()
                )

                .resourceTypeId(
                        reservation.getResource()
                                .getResourceType()
                                .getId()
                )
                .resourceTypeName(
                        reservation.getResource()
                                .getResourceType()
                                .getName()
                )

                .reservationDate(
                        reservation.getReservationDate()
                )
                .startTime(
                        reservation.getStartTime()
                )
                .endTime(
                        reservation.getEndTime()
                )

                .totalPrice(
                        reservation.getTotalPrice()
                )
                .status(
                        reservation.getStatus()
                )

                .note(
                        reservation.getNote()
                )

                .googleCalendarEventId(
                        reservation.getGoogleCalendarEventId()
                )


                .createdAt(
                        reservation.getCreatedAt()
                )
                .updatedAt(
                        reservation.getUpdatedAt()
                )

                .build();
    }

    public void updateEntity(
            UpdateReservationRequest request,
            Reservation reservation
    ) {

        if (request == null || reservation == null) {
            return;
        }

        if (request.getReservationDate() != null) {
            reservation.setReservationDate(
                    request.getReservationDate()
            );
        }

        if (request.getStartTime() != null) {
            reservation.setStartTime(
                    request.getStartTime()
            );
        }

        if (request.getEndTime() != null) {
            reservation.setEndTime(
                    request.getEndTime()
            );
        }

        /*
         * Resource diubah di ReservationService,
         * bukan di mapper.
         *
         * Customer juga tidak diubah di mapper.
         * Customer ditentukan oleh CustomerService.
         */
    }
}

