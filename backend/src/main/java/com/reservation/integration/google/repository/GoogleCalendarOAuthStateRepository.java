package com.reservation.integration.google.repository;

import com.reservation.integration.google.entity.GoogleCalendarOAuthState;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface GoogleCalendarOAuthStateRepository
        extends JpaRepository<GoogleCalendarOAuthState, Long> {

    Optional<GoogleCalendarOAuthState> findByStateAndConsumedFalse(
            String state
    );

    void deleteByExpiresAtBefore(
            LocalDateTime dateTime
    );
}