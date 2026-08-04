package com.reservation.reservation.dto.response;

import com.reservation.reservation.entity.ReservationStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
public class ReservationResponse {

    private Long id;

    private LocalDate reservationDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private Long customerId;

    private String customerName;

    private Long roomId;

    private String roomName;

    private BigDecimal totalPrice;

    private ReservationStatus status;

    private String note;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}