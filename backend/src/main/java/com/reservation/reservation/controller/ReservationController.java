package com.reservation.reservation.controller;

import com.reservation.common.response.ApiResponse;
import com.reservation.reservation.dto.request.CreateReservationRequest;
import com.reservation.reservation.dto.request.ReservationStatusRequest;
import com.reservation.reservation.dto.request.UpdateReservationRequest;
import com.reservation.reservation.dto.response.ReservationResponse;
import com.reservation.reservation.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ReservationResponse> create(
            @Valid @RequestBody CreateReservationRequest request
    ) {
        return ApiResponse.success(
                reservationService.create(request)
        );
    }

    @GetMapping
    public ApiResponse<List<ReservationResponse>> getAll() {
        return ApiResponse.success(
                reservationService.getAll()
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<ReservationResponse> getById(
            @PathVariable Long id
    ) {
        return ApiResponse.success(
                reservationService.getById(id)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<ReservationResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReservationRequest request
    ) {
        return ApiResponse.success(
                reservationService.update(id, request)
        );
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<ReservationResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ReservationStatusRequest request
    ) {
        return ApiResponse.success(
                reservationService.updateStatus(
                        id,
                        request
                )
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id
    ) {
        reservationService.delete(id);
    }
}