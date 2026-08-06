package com.reservation.auth.service;

import com.reservation.auth.dto.request.RegisterRequest;
import com.reservation.auth.dto.response.UserResponse;
import com.reservation.auth.dto.request.LoginRequest;
import com.reservation.auth.dto.response.LoginResponse;
import com.reservation.auth.entity.User;


public interface AuthService {

    UserResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    UserResponse getCurrentUser();
    User getCurrentUserEntity();
}