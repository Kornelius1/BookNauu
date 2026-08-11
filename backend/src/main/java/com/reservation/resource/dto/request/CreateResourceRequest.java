package com.reservation.resource.dto.request;

import com.reservation.resource.entity.ResourceStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateResourceRequest {

    @NotNull
    private Long resourceTypeId;

    @NotBlank
    @Size(max = 150)
    private String name;

    @Size(max = 500)
    private String description;

    private Integer capacity;

    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal price;

    @NotNull
    private ResourceStatus status;

    @Size(max = 500)
    private String imageUrl;
}