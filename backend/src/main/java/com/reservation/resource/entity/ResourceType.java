package com.reservation.resource.entity;

import com.reservation.business.entity.Business;
import com.reservation.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "resource_types",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_resource_types_business_name",
                        columnNames = {
                                "business_id",
                                "name"
                        }
                )
        }
)
@Getter
@Setter
public class ResourceType extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "business_id",
            nullable = false,
            foreignKey = @ForeignKey(
                    name = "fk_resource_types_business"
            )
    )
    private Business business;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 500)
    private String description;
}