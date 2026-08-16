package com.reservation.integration.google.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeRequestUrl;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.reservation.business.entity.Business;
import com.reservation.business.repository.BusinessRepository;
import com.reservation.integration.google.config.GoogleCalendarProperties;
import com.reservation.integration.google.entity.GoogleCalendarConnection;
import com.reservation.integration.google.repository.GoogleCalendarConnectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.reservation.reservation.entity.Reservation;
import com.reservation.reservation.repository.ReservationRepository;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GoogleCalendarOAuthServiceImpl
        implements GoogleCalendarOAuthService {

    private final BusinessRepository businessRepository;

    private static final GsonFactory JSON_FACTORY =
            GsonFactory.getDefaultInstance();

    private static final String USERINFO_URL =
            "https://openidconnect.googleapis.com/v1/userinfo";

    private static final List<String> SCOPES = List.of(
            CalendarScopes.CALENDAR_APP_CREATED,
            "https://www.googleapis.com/auth/userinfo.email"
    );

    private final GoogleCalendarProperties properties;

    private final GoogleCalendarConnectionRepository
            googleCalendarConnectionRepository;

    private final GoogleCalendarService googleCalendarService;

    @Override
    public String buildAuthorizationUrl(String state) {

        return new GoogleAuthorizationCodeRequestUrl(
                "https://accounts.google.com/o/oauth2/v2/auth",
                properties.getClientId(),
                properties.getRedirectUri(),
                SCOPES
        )
                .setAccessType("offline")
                .set("prompt", "consent")
                .setState(state)
                .build();
    }

    @Override
    public void handleCallback(
            String code,
            Long businessId) {

        try {

            Business business =
                    businessRepository
                            .findById(businessId)
                            .orElseThrow(() ->
                                    new IllegalStateException(
                                            "Business not found: "
                                                    + businessId
                                    )
                            );

            GoogleCalendarConnection existingConnection =
                    googleCalendarConnectionRepository
                            .findByBusinessId(
                                    business.getId()
                            )
                            .orElse(null);

            HttpTransport httpTransport =
                    GoogleNetHttpTransport.newTrustedTransport();

            GoogleAuthorizationCodeFlow flow =
                    new GoogleAuthorizationCodeFlow.Builder(
                            httpTransport,
                            JSON_FACTORY,
                            properties.getClientId(),
                            properties.getClientSecret(),
                            SCOPES
                    )
                            .setAccessType("offline")
                            .build();

            GoogleTokenResponse tokenResponse =
                    flow.newTokenRequest(code)
                            .setRedirectUri(
                                    properties.getRedirectUri()
                            )
                            .execute();

            String accessToken =
                    tokenResponse.getAccessToken();

            String newRefreshToken =
                    tokenResponse.getRefreshToken();

            if (accessToken == null
                    || accessToken.isBlank()) {

                throw new IllegalStateException(
                        "Google did not return an access token"
                );
            }

            /*
             * Jika Google tidak memberikan refresh token baru,
             * gunakan refresh token lama.
             */
            String refreshToken;

            if (newRefreshToken != null
                    && !newRefreshToken.isBlank()) {

                refreshToken = newRefreshToken;

            } else if (existingConnection != null
                    && existingConnection.getRefreshToken() != null
                    && !existingConnection
                    .getRefreshToken()
                    .isBlank()) {

                refreshToken =
                        existingConnection.getRefreshToken();

            } else {

                throw new IllegalStateException(
                        "Google did not return a refresh token"
                );
            }

            GoogleCredential credential =
                    new GoogleCredential.Builder()
                            .setTransport(httpTransport)
                            .setJsonFactory(JSON_FACTORY)
                            .setClientSecrets(
                                    properties.getClientId(),
                                    properties.getClientSecret()
                            )
                            .build()
                            .setAccessToken(accessToken)
                            .setRefreshToken(refreshToken);

            String googleAccountEmail =
                    getGoogleAccountEmail(
                            httpTransport,
                            credential
                    );

            /*
             * Gunakan calendar lama jika connection
             * sudah ada.
             */
            String calendarId;

            if (existingConnection != null
                    && existingConnection.getCalendarId() != null
                    && !existingConnection
                    .getCalendarId()
                    .isBlank()) {

                calendarId =
                        existingConnection.getCalendarId();

            } else {

                Calendar calendar =
                        new Calendar.Builder(
                                httpTransport,
                                JSON_FACTORY,
                                credential
                        )
                                .setApplicationName("BookNauu")
                                .build();

                com.google.api.services.calendar.model.Calendar
                        bookNauuCalendar =
                        new com.google.api.services.calendar.model.Calendar();

                bookNauuCalendar.setSummary(
                        "BookNauu Reservations"
                );

                bookNauuCalendar.setDescription(
                        "Reservation calendar managed by BookNauu"
                );

                com.google.api.services.calendar.model.Calendar
                        createdCalendar =
                        calendar.calendars()
                                .insert(bookNauuCalendar)
                                .execute();

                calendarId =
                        createdCalendar.getId();
            }

            GoogleCalendarConnection connection;

            if (existingConnection != null) {

                connection = existingConnection;

            } else {

                connection =
                        GoogleCalendarConnection
                                .builder()
                                .business(business)
                                .connectedAt(
                                        LocalDateTime.now()
                                )
                                .build();
            }

            connection.setGoogleAccountEmail(
                    googleAccountEmail
            );

            connection.setCalendarId(
                    calendarId
            );

            connection.setRefreshToken(
                    refreshToken
            );

            connection.setUpdatedAt(
                    LocalDateTime.now()
            );

            if (connection.getConnectedAt() == null) {

                connection.setConnectedAt(
                        LocalDateTime.now()
                );
            }

            googleCalendarConnectionRepository.save(
                    connection
            );

            googleCalendarService.syncConfirmedReservations(
                    businessId
            );

            googleCalendarService.startWatch(businessId);

            System.out.println(
                    "=== GOOGLE CALENDAR CONNECTED ==="
            );

            System.out.println(
                    "Business ID: " + business.getId()
            );

            System.out.println(
                    "Calendar ID: " + connection.getCalendarId()
            );

            System.out.println(
                    "Google Account: "
                            + connection.getGoogleAccountEmail()
            );

            System.out.println(
                    "Starting confirmed reservation sync..."
            );


            System.out.println(
                    "Confirmed reservation sync finished."
            );
        } catch (
                GeneralSecurityException |
                IOException e
        ) {

            throw new IllegalStateException(
                    "Failed to connect Google Calendar",
                    e
            );
        }
    }

    private String getGoogleAccountEmail(
            HttpTransport httpTransport,
            GoogleCredential credential
    ) throws IOException {

        HttpRequest request =
                httpTransport
                        .createRequestFactory(credential)
                        .buildGetRequest(
                                new GenericUrl(USERINFO_URL)
                        );

        String response =
                request.execute()
                        .parseAsString();

        JsonObject json =
                JsonParser.parseString(response)
                        .getAsJsonObject();

        if (!json.has("email")
                || json.get("email").isJsonNull()
                || json.get("email").getAsString().isBlank()) {

            throw new IllegalStateException(
                    "Unable to retrieve Google account email"
            );
        }

        return json.get("email").getAsString();
    }
}