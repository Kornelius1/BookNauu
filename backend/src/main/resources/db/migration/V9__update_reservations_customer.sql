ALTER TABLE reservations
DROP CONSTRAINT fk_reservations_customer;

ALTER TABLE reservations
    ADD CONSTRAINT fk_reservations_customer
        FOREIGN KEY (customer_id)
            REFERENCES customers(id)
            ON DELETE CASCADE;