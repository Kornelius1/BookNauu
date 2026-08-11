package com.reservation.auth.controller;

import com.reservation.auth.dto.request.LoginRequest;
import com.reservation.auth.dto.request.RegisterRequest;
import com.reservation.auth.dto.response.LoginResponse;
import com.reservation.auth.dto.response.RegisterResponse;
import com.reservation.auth.service.AuthService;
import com.reservation.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.reservation.auth.dto.response.CurrentUserResponse;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {

        System.out.println("========== LOGIN CONTROLLER ==========");

        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Login successful",
                        response
                )
        );
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        RegisterResponse response =
                authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Business registered successfully",
                                response
                        )
                );
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<CurrentUserResponse>> me() {

        CurrentUserResponse response =
                authService.getCurrentUser();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Current user retrieved successfully",
                        response
                )
        );
    }

}