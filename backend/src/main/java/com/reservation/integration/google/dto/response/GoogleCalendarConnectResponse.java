package com.reservation.integration.google.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GoogleCalendarConnectResponse {

    private String authorizationUrl;
}