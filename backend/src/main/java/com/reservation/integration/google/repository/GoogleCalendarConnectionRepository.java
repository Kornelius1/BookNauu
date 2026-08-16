package com.reservation.integration.google.repository;

import com.reservation.integration.google.entity.GoogleCalendarConnection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GoogleCalendarConnectionRepository
        extends JpaRepository<GoogleCalendarConnection, Long> {

    Optional<GoogleCalendarConnection> findByBusinessId(
            Long businessId
    );

    Optional<GoogleCalendarConnection> findByChannelId(
            String channelId
    );

    boolean existsByBusinessId(
            Long businessId
    );

    void deleteByBusinessId(
            Long businessId
    );
}