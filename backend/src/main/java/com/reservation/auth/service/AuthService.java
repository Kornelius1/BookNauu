package com.reservation.auth.service;

import com.reservation.auth.dto.request.RegisterRequest;
import com.reservation.auth.dto.response.RegisterResponse;
import com.reservation.auth.dto.request.LoginRequest;
import com.reservation.auth.dto.response.LoginResponse;
import com.reservation.auth.entity.User;
import com.reservation.auth.dto.response.CurrentUserResponse;


public interface AuthService {

    RegisterResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    CurrentUserResponse getCurrentUser();
    User getCurrentUserEntity();
}