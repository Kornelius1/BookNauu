CREATE TABLE customers
(
    id BIGSERIAL PRIMARY KEY,

    business_id BIGINT NOT NULL,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(150),

    phone VARCHAR(30),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_customers_business
        FOREIGN KEY (business_id)
            REFERENCES businesses(id)
            ON DELETE CASCADE
);

CREATE INDEX idx_customers_business
    ON customers(business_id);

CREATE INDEX idx_customers_business_email
    ON customers(business_id, email);

CREATE INDEX idx_customers_business_phone
    ON customers(business_id, phone);