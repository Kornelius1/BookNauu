package com.reservation.auth.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CurrentUserResponse {

    private UserResponse user;

    private BusinessContextResponse business;
}