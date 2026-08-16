CREATE TABLE google_calendar_oauth_states (
                                              id BIGSERIAL PRIMARY KEY,

                                              state VARCHAR(128) NOT NULL UNIQUE,

                                              owner_id BIGINT NOT NULL,

                                              business_id BIGINT NOT NULL,

                                              expires_at TIMESTAMP NOT NULL,

                                              consumed BOOLEAN NOT NULL DEFAULT FALSE,

                                              created_at TIMESTAMP NOT NULL,

                                              CONSTRAINT fk_google_calendar_oauth_state_owner
                                                  FOREIGN KEY (owner_id)
                                                      REFERENCES users(id),

                                              CONSTRAINT fk_google_calendar_oauth_state_business
                                                  FOREIGN KEY (business_id)
                                                      REFERENCES businesses(id)
);

CREATE INDEX idx_google_calendar_oauth_state_expires_at
    ON google_calendar_oauth_states(expires_at);