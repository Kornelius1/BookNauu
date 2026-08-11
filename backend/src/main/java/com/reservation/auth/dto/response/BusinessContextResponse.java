package com.reservation.auth.dto.response;

import com.reservation.business.entity.BusinessRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BusinessContextResponse {

    private Long businessId;

    private String businessName;

    private String businessSlug;

    private BusinessRole role;
}