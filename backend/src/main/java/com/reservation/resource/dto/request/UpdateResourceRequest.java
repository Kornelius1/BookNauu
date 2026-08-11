package com.reservation.resource.dto.request;

import com.reservation.resource.entity.ResourceStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class UpdateResourceRequest {

    private Long resourceTypeId;

    @Size(max = 150)
    private String name;

    @Size(max = 500)
    private String description;

    private Integer capacity;

    @DecimalMin(value = "0.0")
    private BigDecimal price;

    private ResourceStatus status;

    @Size(max = 500)
    private String imageUrl;
}