CREATE TABLE business_invitations
(
    id BIGSERIAL PRIMARY KEY,

    business_id BIGINT NOT NULL,

    email VARCHAR(150) NOT NULL,

    token VARCHAR(255) NOT NULL UNIQUE,

    role VARCHAR(20) NOT NULL,

    status VARCHAR(20) NOT NULL,

    expires_at TIMESTAMP NOT NULL,

    accepted_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_business_invitations_business
        FOREIGN KEY (business_id)
            REFERENCES businesses(id)
            ON DELETE CASCADE
);


CREATE INDEX idx_business_invitations_token
    ON business_invitations(token);

CREATE INDEX idx_business_invitations_email
    ON business_invitations(email);

CREATE INDEX idx_business_invitations_business
    ON business_invitations(business_id);