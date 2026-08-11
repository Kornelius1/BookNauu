package com.reservation.reservation.dto.request;

import com.reservation.customer.dto.request.CustomerRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePublicReservationRequest {


    @NotNull(message = "Customer information is required")
    @Valid
    private CustomerRequest customer;

    @NotNull(message = "Resource is required")
    private Long resourceId;

    @NotNull(message = "Reservation date is required")
    @FutureOrPresent(message = "Reservation date cannot be in the past")
    private LocalDate reservationDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @Size(max = 500, message = "Note must not exceed 500 characters")
    private String note;


}
