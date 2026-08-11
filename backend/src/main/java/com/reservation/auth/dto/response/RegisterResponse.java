package com.reservation.auth.dto.response;

import com.reservation.business.dto.response.BusinessResponse;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RegisterResponse {

    private UserResponse user;

    private BusinessResponse business;
}