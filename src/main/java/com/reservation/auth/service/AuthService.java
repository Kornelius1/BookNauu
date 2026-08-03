package com.reservation.auth.service;

import com.reservation.auth.dto.request.RegisterRequest;
import com.reservation.auth.dto.response.UserResponse;

public interface AuthService {

    UserResponse register(RegisterRequest request);

}