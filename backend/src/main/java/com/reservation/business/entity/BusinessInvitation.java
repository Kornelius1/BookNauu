package com.reservation.business.entity;

import com.reservation.common.entity.BaseEntity;
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
        name = "business_invitations",
        indexes = {
                @Index(name = "idx_business_invitations_token", columnList = "token"),
                @Index(name = "idx_business_invitations_email", columnList = "email")
        }
)
public class BusinessInvitation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "business_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_business_invitations_business"
            )
    )
    private Business business;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(nullable = false, unique = true, length = 255)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BusinessRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BusinessInvitationStatus status;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;
}