package com.reservation.integration.google.dto.response;



public record GoogleCalendarStatusResponse(
        boolean connected,
        String googleAccountEmail,
        String calendarId
) {
}