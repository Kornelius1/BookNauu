package com.reservation.integration.google.entity;

import com.reservation.business.entity.Business;
import com.reservation.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "google_calendar_oauth_states",
        indexes = {
                @Index(
                        name = "idx_google_calendar_oauth_state",
                        columnList = "state",
                        unique = true
                ),
                @Index(
                        name = "idx_google_calendar_oauth_state_expires_at",
                        columnList = "expires_at"
                )
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleCalendarOAuthState {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            nullable = false,
            unique = true,
            length = 128
    )
    private String state;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "business_id",
            nullable = false
    )
    private Business business;

    @Column(
            name = "expires_at",
            nullable = false
    )
    private LocalDateTime expiresAt;

    @Column(
            nullable = false
    )
    private boolean consumed;

    @Column(
            name = "created_at",
            nullable = false
    )
    private LocalDateTime createdAt;
}