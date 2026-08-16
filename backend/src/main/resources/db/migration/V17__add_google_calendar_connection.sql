ALTER TABLE google_calendar_connections
    ADD COLUMN channel_id VARCHAR(255);

ALTER TABLE google_calendar_connections
    ADD COLUMN resource_id VARCHAR(255);

ALTER TABLE google_calendar_connections
    ADD COLUMN channel_expiration BIGINT;