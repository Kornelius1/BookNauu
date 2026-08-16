ALTER TABLE google_calendar_oauth_states
DROP CONSTRAINT IF EXISTS fk_google_calendar_oauth_state_owner;

ALTER TABLE google_calendar_oauth_states
DROP COLUMN IF EXISTS owner_id;