package com.reservation.reservation.service;

import com.reservation.reservation.dto.request.CreateReservationRequest;
import com.reservation.reservation.dto.request.ReservationStatusRequest;
import com.reservation.reservation.dto.request.UpdateReservationRequest;
import com.reservation.reservation.dto.response.ReservationResponse;

import java.util.List;

public interface ReservationService {

    ReservationResponse create(CreateReservationRequest request);

    ReservationResponse update(Long id, UpdateReservationRequest request);

    ReservationResponse getById(Long id);

    List<ReservationResponse> getAll();

    List<ReservationResponse> getMyReservations();

    ReservationResponse updateStatus(
            Long id,
            ReservationStatusRequest request
    );

    void delete(Long id);

}