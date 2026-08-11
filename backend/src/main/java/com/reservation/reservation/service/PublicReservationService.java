package com.reservation.reservation.service;

import com.reservation.reservation.dto.request.CreatePublicReservationRequest;
import com.reservation.reservation.dto.response.ReservationResponse;

public interface PublicReservationService {


    ReservationResponse create(
            String businessSlug,
            CreatePublicReservationRequest request
    );

}
