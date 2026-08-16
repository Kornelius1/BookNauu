CREATE TABLE google_calendar_connections (
                                             id BIGSERIAL PRIMARY KEY,

                                             business_id BIGINT NOT NULL,

                                             google_account_email VARCHAR(255) NOT NULL,

                                             calendar_id VARCHAR(255) NOT NULL,

                                             refresh_token TEXT NOT NULL,

                                             connected_at TIMESTAMP NOT NULL,
                                             updated_at TIMESTAMP NOT NULL,

                                             CONSTRAINT uq_google_calendar_connections_business
                                                 UNIQUE (business_id),

                                             CONSTRAINT fk_google_calendar_connections_business
                                                 FOREIGN KEY (business_id)
                                                     REFERENCES businesses(id)
                                                     ON DELETE CASCADE
);