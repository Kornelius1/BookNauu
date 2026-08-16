package com.reservation.integration.google.service;

public interface GoogleCalendarOAuthService {

    String buildAuthorizationUrl(String State);

    void handleCallback(
            String code,
            Long businessId
    );

}