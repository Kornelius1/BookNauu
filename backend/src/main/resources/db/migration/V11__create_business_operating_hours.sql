CREATE TABLE business_operating_hours
(
    id BIGSERIAL PRIMARY KEY,

    business_id BIGINT NOT NULL,

    day_of_week VARCHAR(10) NOT NULL,

    open_time TIME,

    close_time TIME,

    is_closed BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_business_operating_hours_business
        FOREIGN KEY (business_id)
            REFERENCES businesses(id)
            ON DELETE CASCADE,

    CONSTRAINT uq_business_operating_hours_business_day
        UNIQUE (business_id, day_of_week)
);

CREATE INDEX idx_business_operating_hours_business
    ON business_operating_hours(business_id);