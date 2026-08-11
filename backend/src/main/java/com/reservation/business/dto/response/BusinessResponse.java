package com.reservation.business.dto.response;

import com.reservation.business.entity.BusinessStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BusinessResponse {

    private Long id;

    private String name;

    private String slug;

    private String description;

    private String phone;

    private String email;

    private String address;

    private BusinessStatus status;
}