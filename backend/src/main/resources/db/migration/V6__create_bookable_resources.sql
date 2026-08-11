CREATE TABLE bookable_resources
(
    id BIGSERIAL PRIMARY KEY,

    business_id BIGINT NOT NULL,

    resource_type_id BIGINT NOT NULL,

    name VARCHAR(150) NOT NULL,

    description VARCHAR(500),

    capacity INTEGER,

    price DECIMAL(12, 2) NOT NULL,

    status VARCHAR(20) NOT NULL,

    image_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bookable_resources_business
        FOREIGN KEY (business_id)
            REFERENCES businesses(id)
            ON DELETE CASCADE,

    CONSTRAINT fk_bookable_resources_type
        FOREIGN KEY (resource_type_id)
            REFERENCES resource_types(id)
            ON DELETE RESTRICT
);

CREATE INDEX idx_bookable_resources_business
    ON bookable_resources(business_id);

CREATE INDEX idx_bookable_resources_type
    ON bookable_resources(resource_type_id);

CREATE INDEX idx_bookable_resources_business_type
    ON bookable_resources(business_id, resource_type_id);

CREATE INDEX idx_bookable_resources_status
    ON bookable_resources(status);