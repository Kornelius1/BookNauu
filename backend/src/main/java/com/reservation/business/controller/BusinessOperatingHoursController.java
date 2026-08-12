package com.reservation.business.controller;

import com.reservation.business.dto.request.UpdateOperatingHoursRequest;
import com.reservation.business.dto.response.OperatingHoursResponse;
import com.reservation.business.service.BusinessOperatingHoursService;
import com.reservation.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/business/operating-hours")
@RequiredArgsConstructor
public class BusinessOperatingHoursController {

    private final BusinessOperatingHoursService
            operatingHoursService;


    @GetMapping
    public ApiResponse<List<OperatingHoursResponse>>
    getOperatingHours() {

        return ApiResponse.success(
                operatingHoursService.getOperatingHours()
        );
    }


    @PutMapping
    public ApiResponse<OperatingHoursResponse>
    updateOperatingHours(
            @Valid @RequestBody
            UpdateOperatingHoursRequest request
    ) {

        return ApiResponse.success(
                operatingHoursService
                        .updateOperatingHours(request)
        );
    }
}