package com.reservation.integration.google.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.reservation.integration.google.config.GoogleCalendarProperties;
import com.reservation.integration.google.dto.response.GoogleCalendarStatusResponse;
import com.reservation.integration.google.entity.GoogleCalendarConnection;
import com.reservation.integration.google.repository.GoogleCalendarConnectionRepository;
import com.reservation.reservation.entity.Reservation;
import com.reservation.reservation.entity.ReservationStatus;
import com.reservation.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.google.api.services.calendar.model.Channel;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoogleCalendarServiceImpl
        implements GoogleCalendarService {

    private static final Logger log =
            LoggerFactory.getLogger(
                    GoogleCalendarServiceImpl.class
            );

    private static final GsonFactory JSON_FACTORY =
            GsonFactory.getDefaultInstance();

    private static final String APPLICATION_NAME =
            "BookNauu";

    private final GoogleCalendarConnectionRepository
            googleCalendarConnectionRepository;

    private final ReservationRepository
            reservationRepository;

    private final GoogleCalendarProperties properties;


    @Override
    @Transactional
    public void createEvent(
            Reservation reservation
    ) {

        try {

            log.info(
                    "Creating Google Calendar event: reservationId={}, businessId={}, eventId={}",
                    reservation.getId(),
                    reservation.getBusiness().getId(),
                    reservation.getGoogleCalendarEventId()
            );

            GoogleCalendarConnection connection =
                    getConnection(reservation);

            log.info(
                    "Google Calendar connection found: {}",
                    connection != null
            );

            if (connection == null) {
                return;
            }

            Calendar calendar =
                    getCalendarClient(connection);

            Event event =
                    buildEvent(reservation);

            Event createdEvent =
                    calendar.events()
                            .insert(
                                    connection.getCalendarId(),
                                    event
                            )
                            .execute();

            reservation.setGoogleCalendarEventId(
                    createdEvent.getId()
            );

            log.info(
                    "Google Calendar event created successfully: reservationId={}, eventId={}, calendarId={}, start={}, end={}, timeZone={}",
                    reservation.getId(),
                    createdEvent.getId(),
                    connection.getCalendarId(),
                    createdEvent.getStart().getDateTime(),
                    createdEvent.getEnd().getDateTime(),
                    createdEvent.getStart().getTimeZone()
            );

            reservationRepository.save(reservation);

        } catch (Exception e) {

            log.error(
                    "Failed to create Google Calendar event for reservation {}",
                    reservation.getId(),
                    e
            );

        }
    }


    @Override
    @Transactional
    public void syncConfirmedReservations(
            Long businessId
    ) {

        List<Reservation> confirmedReservations =
                reservationRepository
                        .findByBusinessIdAndStatus(
                                businessId,
                                ReservationStatus.CONFIRMED
                        );

        for (Reservation reservation :
                confirmedReservations) {

            if (reservation.getGoogleCalendarEventId() == null
                    || reservation.getGoogleCalendarEventId().isBlank()) {

                createEvent(reservation);
            }
        }
    }


    @Override
    @Transactional
    public void updateEvent(
            Reservation reservation
    ) {

        try {

            GoogleCalendarConnection connection =
                    getConnection(reservation);

            if (connection == null) {
                return;
            }

            /*
             * Reservation sudah CONFIRMED,
             * tetapi belum mempunyai Google Event.
             */
            if (reservation.getGoogleCalendarEventId() == null
                    || reservation.getGoogleCalendarEventId().isBlank()) {

                createEvent(reservation);
                return;
            }

            Calendar calendar =
                    getCalendarClient(connection);

            Event event =
                    buildEvent(reservation);

            Event updatedEvent =
                    calendar.events()
                            .update(
                                    connection.getCalendarId(),
                                    reservation.getGoogleCalendarEventId(),
                                    event
                            )
                            .execute();

            reservation.setGoogleCalendarEventId(
                    updatedEvent.getId()
            );

            log.info(
                    "Google Calendar event updated successfully: reservationId={}, eventId={}, calendarId={}, start={}, end={}, timeZone={}",
                    reservation.getId(),
                    updatedEvent.getId(),
                    connection.getCalendarId(),
                    updatedEvent.getStart().getDateTime(),
                    updatedEvent.getEnd().getDateTime(),
                    updatedEvent.getStart().getTimeZone()
            );

            reservationRepository.save(reservation);

        } catch (Exception e) {

            log.error(
                    "Failed to update Google Calendar event for reservation {}",
                    reservation.getId(),
                    e
            );
        }
    }


    @Override
    @Transactional
    public void deleteEvent(
            Reservation reservation
    ) {

        String eventId =
                reservation.getGoogleCalendarEventId();

        if (eventId == null || eventId.isBlank()) {
            return;
        }

        try {

            GoogleCalendarConnection connection =
                    getConnection(reservation);

            if (connection == null) {
                return;
            }

            Calendar calendar =
                    getCalendarClient(connection);

            calendar.events()
                    .delete(
                            connection.getCalendarId(),
                            eventId
                    )
                    .execute();

        } catch (Exception e) {

            // Google Calendar integration failure
            // must not break reservation deletion.

        } finally {

            reservation.setGoogleCalendarEventId(null);
        }
    }



    @Override
    @Transactional
    public void handleCalendarWebhook(
            String channelId,
            String resourceId,
            String resourceState
    ) {
        GoogleCalendarConnection connection =
                googleCalendarConnectionRepository
                        .findByChannelId(channelId)
                        .orElse(null);

        if (connection == null) {
            return;
        }

        if (resourceId != null
                && connection.getResourceId() != null
                && !connection.getResourceId().equals(resourceId)) {
            return;
        }

        if ("sync".equals(resourceState)) {
            return;
        }

        if ("exists".equals(resourceState)) {

            syncReservationsFromGoogle(
                    connection
            );
        }
    }

    @Override
    @Transactional
    public void startWatch(Long businessId) {

        GoogleCalendarConnection connection =
                googleCalendarConnectionRepository
                        .findByBusinessId(businessId)
                        .orElse(null);

        if (connection == null) {
            return;
        }

        try {
            Calendar calendar =
                    getCalendarClient(connection);

            String channelId =
                    UUID.randomUUID().toString();

            Channel channel =
                    new Channel()
                            .setId(channelId)
                            .setType("web_hook")
                            .setAddress(properties.getWebhookUrl());

            Channel response =
                    calendar.events()
                            .watch(
                                    connection.getCalendarId(),
                                    channel
                            )
                            .execute();

            connection.setChannelId(response.getId());
            connection.setResourceId(response.getResourceId());
            connection.setChannelExpiration(
                    response.getExpiration()
            );
            connection.setUpdatedAt(
                    LocalDateTime.now()
            );

            googleCalendarConnectionRepository.save(
                    connection
            );

        } catch (Exception e) {
            log.error(
                    "Failed to start Google Calendar watch for business {}",
                    businessId,
                    e
            );
        }
    }

    /**
     * Mengambil koneksi Google Calendar berdasarkan
     * business yang memiliki reservation.
     */
    private GoogleCalendarConnection getConnection(
            Reservation reservation
    ) {

        if (reservation.getBusiness() == null
                || reservation.getBusiness().getId() == null) {

            return null;
        }

        return googleCalendarConnectionRepository
                .findByBusinessId(
                        reservation.getBusiness().getId()
                )
                .orElse(null);
    }


    private Calendar getCalendarClient(
            GoogleCalendarConnection connection
    ) throws GeneralSecurityException, IOException {

        HttpTransport httpTransport =
                GoogleNetHttpTransport
                        .newTrustedTransport();

        GoogleCredential credential =
                new GoogleCredential.Builder()
                        .setTransport(httpTransport)
                        .setJsonFactory(JSON_FACTORY)
                        .setClientSecrets(
                                properties.getClientId(),
                                properties.getClientSecret()
                        )
                        .build()
                        .setRefreshToken(
                                connection.getRefreshToken()
                        );

        boolean refreshed =
                credential.refreshToken();

        if (!refreshed
                || credential.getAccessToken() == null
                || credential.getAccessToken().isBlank()) {

            throw new IllegalStateException(
                    "Unable to refresh Google access token"
            );
        }

        return new Calendar.Builder(
                httpTransport,
                JSON_FACTORY,
                credential
        )
                .setApplicationName(APPLICATION_NAME)
                .build();
    }


    private void syncReservationsFromGoogle(
            GoogleCalendarConnection connection
    ) {

        try {

            Calendar calendar =
                    getCalendarClient(connection);

            List<Reservation> reservations =
                    reservationRepository
                            .findByBusinessIdAndStatus(
                                    connection.getBusiness().getId(),
                                    ReservationStatus.CONFIRMED
                            );

            for (Reservation reservation : reservations) {

                String eventId =
                        reservation.getGoogleCalendarEventId();

                if (eventId == null
                        || eventId.isBlank()) {
                    continue;
                }

                Event event =
                        calendar.events()
                                .get(
                                        connection.getCalendarId(),
                                        eventId
                                )
                                .execute();

                if (event == null) {
                    continue;
                }

                if ("cancelled".equals(event.getStatus())) {
                    continue;
                }

                if (event.getStart() == null
                        || event.getEnd() == null
                        || event.getStart().getDateTime() == null
                        || event.getEnd().getDateTime() == null) {
                    continue;
                }

                ZoneId zoneId =
                        ZoneId.systemDefault();

                LocalDateTime start =
                        LocalDateTime.ofInstant(
                                java.time.Instant.ofEpochMilli(
                                        event.getStart()
                                                .getDateTime()
                                                .getValue()
                                ),
                                zoneId
                        );

                LocalDateTime end =
                        LocalDateTime.ofInstant(
                                java.time.Instant.ofEpochMilli(
                                        event.getEnd()
                                                .getDateTime()
                                                .getValue()
                                ),
                                zoneId
                        );

                boolean changed = false;

                if (!reservation.getReservationDate()
                        .equals(start.toLocalDate())) {

                    reservation.setReservationDate(
                            start.toLocalDate()
                    );

                    changed = true;
                }

                if (!reservation.getStartTime()
                        .equals(start.toLocalTime())) {

                    reservation.setStartTime(
                            start.toLocalTime()
                    );

                    changed = true;
                }

                if (!reservation.getEndTime()
                        .equals(end.toLocalTime())) {

                    reservation.setEndTime(
                            end.toLocalTime()
                    );

                    changed = true;
                }

                if (changed) {

                    reservationRepository.save(
                            reservation
                    );
                }
            }

        } catch (Exception e) {
            // Google Calendar integration failure
            // must not break webhook processing.
        }
    }

    /**
     * Membentuk Google Calendar Event
     * dari Reservation.
     */
    private Event buildEvent(
            Reservation reservation
    ) {

        LocalDateTime start =
                LocalDateTime.of(
                        reservation.getReservationDate(),
                        reservation.getStartTime()
                );

        LocalDateTime end =
                LocalDateTime.of(
                        reservation.getReservationDate(),
                        reservation.getEndTime()
                );

        ZoneId zoneId =
                ZoneId.of("Asia/Jakarta");

        long startMillis =
                start
                        .atZone(zoneId)
                        .toInstant()
                        .toEpochMilli();

        long endMillis =
                end
                        .atZone(zoneId)
                        .toInstant()
                        .toEpochMilli();

        EventDateTime startDateTime =
                new EventDateTime()
                        .setDateTime(
                                new com.google.api.client.util.DateTime(
                                        startMillis
                                )
                        )
                        .setTimeZone(
                                zoneId.getId()
                        );

        EventDateTime endDateTime =
                new EventDateTime()
                        .setDateTime(
                                new com.google.api.client.util.DateTime(
                                        endMillis
                                )
                        )
                        .setTimeZone(
                                zoneId.getId()
                        );

        Event event =
                new Event()
                        .setSummary(
                                "BookNauu Reservation #"
                                        + reservation.getId()
                        )
                        .setDescription(
                                buildDescription(reservation)
                        )
                        .setStart(startDateTime)
                        .setEnd(endDateTime);

        log.info(
                """
                Google Calendar event prepared
                reservationId={}
                date={}
                start={}
                end={}
                timezone={}
                startMillis={}
                endMillis={}
                summary={}
                """,
                reservation.getId(),
                reservation.getReservationDate(),
                reservation.getStartTime(),
                reservation.getEndTime(),
                zoneId.getId(),
                startMillis,
                endMillis,
                event.getSummary()
        );

        log.info(
                "Google Calendar event payload: startDateTime={}, endDateTime={}",
                event.getStart().getDateTime(),
                event.getEnd().getDateTime()
        );

        return event;
    }

    private String buildDescription(
            Reservation reservation
    ) {

        StringBuilder description =
                new StringBuilder();

        description.append(
                "BookNauu Reservation\n"
        );

        description.append(
                "Reservation ID: "
        );

        description.append(
                reservation.getId()
        );

        if (reservation.getNote() != null
                && !reservation.getNote().isBlank()) {

            description.append("\n\nNote: ");
            description.append(
                    reservation.getNote()
            );
        }

        return description.toString();
    }


    @Override
    @Transactional(readOnly = true)
    public GoogleCalendarStatusResponse getConnectionStatus(
            Long businessId
    ) {

        return googleCalendarConnectionRepository
                .findByBusinessId(businessId)
                .map(connection ->
                        new GoogleCalendarStatusResponse(
                                true,
                                connection.getGoogleAccountEmail(),
                                connection.getCalendarId()
                        )
                )
                .orElseGet(() ->
                        new GoogleCalendarStatusResponse(
                                false,
                                null,
                                null
                        )
                );
    }


    @Override
    @Transactional
    public void disconnect(
            Long businessId
    ) {

        googleCalendarConnectionRepository
                .deleteByBusinessId(businessId);
    }
}