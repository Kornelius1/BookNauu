package com.reservation.integration.google.entity;

import com.reservation.business.entity.Business;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "google_calendar_connections",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_google_calendar_connections_business",
                        columnNames = "business_id"
                )
        }
)
public class GoogleCalendarConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "business_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_google_calendar_connections_business"
            )
    )
    private Business business;

    @Column(
            name = "google_account_email",
            nullable = false,
            length = 255
    )
    private String googleAccountEmail;

    @Column(
            name = "calendar_id",
            nullable = false,
            length = 255
    )
    private String calendarId;

    @Column(
            name = "refresh_token",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String refreshToken;

    @Column(
            name = "connected_at",
            nullable = false
    )
    private LocalDateTime connectedAt;

    @Column(
            name = "updated_at",
            nullable = false
    )
    private LocalDateTime updatedAt;


    // ==========================================
    // GOOGLE CALENDAR PUSH NOTIFICATION
    // ==========================================

    @Column(
            name = "channel_id",
            length = 255
    )
    private String channelId;

    @Column(
            name = "resource_id",
            length = 255
    )
    private String resourceId;

    @Column(
            name = "channel_expiration"
    )
    private Long channelExpiration;
}