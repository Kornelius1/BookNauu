CREATE TABLE business_memberships
(
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,

    business_id BIGINT NOT NULL,

    role VARCHAR(20) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_business_memberships_user
        FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE,

    CONSTRAINT fk_business_memberships_business
        FOREIGN KEY (business_id)
            REFERENCES businesses(id)
            ON DELETE CASCADE,

    CONSTRAINT uq_business_memberships_user_business
        UNIQUE (user_id, business_id)
);