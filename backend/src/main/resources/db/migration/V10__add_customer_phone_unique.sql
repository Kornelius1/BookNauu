ALTER TABLE customers
    ADD CONSTRAINT uq_customers_business_phone
        UNIQUE (business_id, phone);