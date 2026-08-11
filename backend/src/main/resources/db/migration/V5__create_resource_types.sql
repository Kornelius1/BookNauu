CREATE TABLE resource_types
(
    id BIGSERIAL PRIMARY KEY,

    business_id BIGINT NOT NULL,

    name VARCHAR(100) NOT NULL,

    description VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_resource_types_business
        FOREIGN KEY (business_id)
            REFERENCES businesses(id)
            ON DELETE CASCADE,

    CONSTRAINT uq_resource_types_business_name
        UNIQUE (business_id, name)
);

CREATE INDEX idx_resource_types_business
    ON resource_types(business_id);