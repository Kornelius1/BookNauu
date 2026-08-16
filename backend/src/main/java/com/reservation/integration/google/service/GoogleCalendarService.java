package com.reservation.integration.google.service;

import com.reservation.integration.google.dto.response.GoogleCalendarStatusResponse;
import com.reservation.reservation.entity.Reservation;

public interface GoogleCalendarService {

    void createEvent(Reservation reservation);

    void updateEvent(Reservation reservation);

    void deleteEvent(Reservation reservation);

    GoogleCalendarStatusResponse getConnectionStatus(Long businessId);

    void disconnect(Long businessId);

    void syncConfirmedReservations(Long businessId);

    void startWatch(Long businessId);

    void handleCalendarWebhook(
            String channelId,
            String resourceId,
            String resourceState
    );
}