package com.reservation.integration.google.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "google.calendar")
public class GoogleCalendarProperties {

    private String clientId;

    private String clientSecret;

    private String redirectUri;

    private String frontendUrl;

    private String webhookUrl;
}