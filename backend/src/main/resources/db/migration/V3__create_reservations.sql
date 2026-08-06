CREATE TABLE reservations
(
    id BIGSERIAL PRIMARY KEY,

    reservation_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    total_price NUMERIC(12,2) NOT NULL,
    note VARCHAR(500),

    status VARCHAR(20) NOT NULL,

    customer_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reservation_customer
        FOREIGN KEY (customer_id)
            REFERENCES users(id),

    CONSTRAINT fk_reservation_room
        FOREIGN KEY (room_id)
            REFERENCES rooms(id)
);