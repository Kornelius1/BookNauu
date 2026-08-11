package com.reservation.resource.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResourceTypeResponse {

    private Long id;

    private Long businessId;

    private String name;

    private String description;
}