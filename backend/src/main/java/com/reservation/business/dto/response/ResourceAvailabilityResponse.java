package com.reservation.business.dto.response;

import com.reservation.resource.entity.ResourceStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResourceAvailabilityResponse {

    private Long resourceId;

    private String resourceName;

    private ResourceStatus status;

    private boolean available;
}