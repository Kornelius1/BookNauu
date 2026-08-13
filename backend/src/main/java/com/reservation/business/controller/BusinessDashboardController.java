package com.reservation.business.controller;

import com.reservation.business.dto.response.BusinessDashboardResponse;
import com.reservation.business.service.BusinessDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/business/dashboard")
@RequiredArgsConstructor
public class BusinessDashboardController {

    private final BusinessDashboardService businessDashboardService;

    @GetMapping
    public ResponseEntity<BusinessDashboardResponse> getDashboard() {

        return ResponseEntity.ok(
                businessDashboardService.getDashboard()
        );
    }
}