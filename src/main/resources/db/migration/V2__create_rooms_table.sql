CREATE TABLE rooms (
                       id BIGSERIAL PRIMARY KEY,

                       name VARCHAR(100) NOT NULL UNIQUE,

                       description VARCHAR(500),

                       capacity INTEGER NOT NULL,

                       price NUMERIC(12,2) NOT NULL,

                       image_url VARCHAR(500),

                       status VARCHAR(20) NOT NULL,

                       created_at TIMESTAMP,

                       updated_at TIMESTAMP,

                       created_by VARCHAR(100),

                       updated_by VARCHAR(100)
);