CREATE TABLE reservations
(
    id BIGSERIAL PRIMARY KEY,

    business_id BIGINT NOT NULL,

    resource_id BIGINT NOT NULL,

    customer_id BIGINT NOT NULL,

    reservation_date DATE NOT NULL,

    start_time TIME NOT NULL,

    end_time TIME NOT NULL,

    total_price DECIMAL(12, 2) NOT NULL,

    note VARCHAR(500),

    status VARCHAR(20) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reservations_business
        FOREIGN KEY (business_id)
            REFERENCES businesses(id)
            ON DELETE CASCADE,

    CONSTRAINT fk_reservations_resource
        FOREIGN KEY (resource_id)
            REFERENCES bookable_resources(id)
            ON DELETE RESTRICT,

    CONSTRAINT fk_reservations_customer
        FOREIGN KEY (customer_id)
            REFERENCES users(id)
            ON DELETE CASCADE
);

CREATE INDEX idx_reservations_business
    ON reservations(business_id);

CREATE INDEX idx_reservations_resource
    ON reservations(resource_id);

CREATE INDEX idx_reservations_customer
    ON reservations(customer_id);

CREATE INDEX idx_reservations_business_date
    ON reservations(business_id, reservation_date);

