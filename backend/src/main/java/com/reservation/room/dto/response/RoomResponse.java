package com.reservation.room.dto.response;

import com.reservation.room.entity.RoomStatus;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomResponse {

    private Long id;

    private String name;

    private String description;

    private Integer capacity;

    private BigDecimal price;

    private String imageUrl;

    private RoomStatus status;
}