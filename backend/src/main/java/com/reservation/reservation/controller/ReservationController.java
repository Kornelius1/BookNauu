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
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    /**
     * Create Reservation
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ReservationResponse>> create(
            @Valid @RequestBody CreateReservationRequest request
    ) {

        ReservationResponse response =
                reservationService.create(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Reservation created successfully",
                        response
                ));
    }

    /**
     * Get All Reservations
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getAll() {

        List<ReservationResponse> response =
                reservationService.getAll();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Reservations retrieved successfully",
                        response
                )
        );
    }

    /**
     * Get Reservation By ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReservationResponse>> getById(
            @PathVariable Long id
    ) {

        ReservationResponse response =
                reservationService.getById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Reservation retrieved successfully",
                        response
                )
        );
    }

    /**
     * Get My Reservations
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> getMyReservations() {

        List<ReservationResponse> response =
                reservationService.getMyReservations();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "My reservations retrieved successfully",
                        response
                )
        );
    }

    /**
     * Update Reservation
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ReservationResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReservationRequest request
    ) {

        ReservationResponse response =
                reservationService.update(id, request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Reservation updated successfully",
                        response
                )
        );
    }

    /**
     * Update Reservation Status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ReservationResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ReservationStatusRequest request
    ) {

        ReservationResponse response =
                reservationService.updateStatus(id, request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Reservation status updated successfully",
                        response
                )
        );
    }

    /**
     * Delete Reservation
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id
    ) {

        reservationService.delete(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Reservation deleted successfully",
                        null
                )
        );
    }

}