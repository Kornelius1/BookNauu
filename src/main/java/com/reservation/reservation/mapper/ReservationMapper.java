package com.reservation.reservation.mapper;

import com.reservation.reservation.dto.request.CreateReservationRequest;
import com.reservation.reservation.dto.request.UpdateReservationRequest;
import com.reservation.reservation.dto.response.ReservationResponse;
import com.reservation.reservation.entity.Reservation;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {

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

    public ReservationResponse toResponse(Reservation reservation) {

        if (reservation == null) {
            return null;
        }

        return ReservationResponse.builder()
                .id(reservation.getId())

                .customerId(reservation.getCustomer().getId())
                .customerName(reservation.getCustomer().getFullName())

                .roomId(reservation.getRoom().getId())
                .roomName(reservation.getRoom().getName())

                .reservationDate(reservation.getReservationDate())
                .startTime(reservation.getStartTime())
                .endTime(reservation.getEndTime())

                .totalPrice(reservation.getTotalPrice())
                .status(reservation.getStatus())

                .createdAt(reservation.getCreatedAt())
                .updatedAt(reservation.getUpdatedAt())

                .build();
    }

    public void updateEntity(
            UpdateReservationRequest request,
            Reservation reservation
    ) {

        if (request.getReservationDate() != null) {
            reservation.setReservationDate(request.getReservationDate());
        }

        if (request.getStartTime() != null) {
            reservation.setStartTime(request.getStartTime());
        }

        if (request.getEndTime() != null) {
            reservation.setEndTime(request.getEndTime());
        }
    }

}