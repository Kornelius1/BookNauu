package com.reservation.integration.google.service;

import com.reservation.business.entity.Business;
import com.reservation.integration.google.entity.GoogleCalendarOAuthState;
import com.reservation.integration.google.repository.GoogleCalendarOAuthStateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.reservation.business.entity.Business;


import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class GoogleCalendarOAuthStateServiceImpl
        implements GoogleCalendarOAuthStateService {

    private static final int STATE_BYTES = 32;

    private static final long EXPIRATION_MINUTES = 10;

    private final GoogleCalendarOAuthStateRepository repository;

    private final SecureRandom secureRandom =
            new SecureRandom();

    @Override
    @Transactional
    public GoogleCalendarOAuthState create(
            Business business
    ) {

        byte[] bytes =
                new byte[STATE_BYTES];

        secureRandom.nextBytes(bytes);

        String state =
                Base64.getUrlEncoder()
                        .withoutPadding()
                        .encodeToString(bytes);

        LocalDateTime now =
                LocalDateTime.now();

        GoogleCalendarOAuthState oauthState =
                GoogleCalendarOAuthState.builder()
                        .state(state)
                        .business(business)
                        .expiresAt(
                                now.plusMinutes(
                                        EXPIRATION_MINUTES
                                )
                        )
                        .consumed(false)
                        .createdAt(now)
                        .build();

        return repository.save(
                oauthState
        );
    }

    @Override
    @Transactional
    public GoogleCalendarOAuthState consume(
            String state
    ) {

        GoogleCalendarOAuthState oauthState =
                repository
                        .findByStateAndConsumedFalse(state)
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "Invalid or already used OAuth state"
                                )
                        );

        if (oauthState
                .getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            throw new IllegalStateException(
                    "Google Calendar OAuth state has expired"
            );
        }

        oauthState.setConsumed(true);

        return repository.save(
                oauthState
        );
    }
}