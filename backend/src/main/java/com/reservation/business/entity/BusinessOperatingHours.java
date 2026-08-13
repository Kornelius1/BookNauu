package com.reservation.business.entity;

import com.reservation.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(
        name = "business_operating_hours",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_business_operating_hours_business_day",
                        columnNames = {
                                "business_id",
                                "day_of_week"
                        }
                )
        }
)
@Getter
@Setter
public class BusinessOperatingHours extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "business_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_business_operating_hours_business"
            )
    )
    private Business business;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "day_of_week",
            nullable = false,
            length = 10
    )
    private DayOfWeek dayOfWeek;

    @Column(name = "open_time")
    private LocalTime openTime;

    @Column(name = "close_time")
    private LocalTime closeTime;

    @Column(name = "is_closed", nullable = false)
    private boolean closed;
}