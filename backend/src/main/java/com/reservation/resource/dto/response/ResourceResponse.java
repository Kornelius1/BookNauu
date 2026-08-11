package com.reservation.resource.dto.response;

import com.reservation.resource.entity.ResourceStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class ResourceResponse {

    private Long id;

    private Long businessId;

    private Long resourceTypeId;

    private String resourceTypeName;

    private String name;

    private String description;

    private Integer capacity;

    private BigDecimal price;

    private ResourceStatus status;

    private String imageUrl;
}