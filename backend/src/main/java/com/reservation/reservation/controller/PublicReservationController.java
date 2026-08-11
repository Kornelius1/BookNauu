package com.reservation.reservation.controller;

import com.reservation.common.response.ApiResponse;
import com.reservation.reservation.dto.request.CreatePublicReservationRequest;
import com.reservation.reservation.dto.response.ReservationResponse;
import com.reservation.reservation.service.PublicReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/{businessSlug}/reservations")
@RequiredArgsConstructor
public class PublicReservationController {

    private final PublicReservationService publicReservationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ReservationResponse> create(
            @PathVariable String businessSlug,
            @Valid @RequestBody CreatePublicReservationRequest request
    ) {
        return ApiResponse.success(
                publicReservationService.create(
                        businessSlug,
                        request
                )
        );
    }
}