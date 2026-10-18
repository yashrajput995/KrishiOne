-- V1__init_schema.sql
-- KrishiOne Core Schema Initialization

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL,
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'hi',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mandis (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Madhya Pradesh',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS commodities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS mandi_prices (
    id BIGSERIAL PRIMARY KEY,
    mandi_id BIGINT NOT NULL REFERENCES mandis(id) ON DELETE CASCADE,
    commodity_id BIGINT NOT NULL REFERENCES commodities(id) ON DELETE CASCADE,
    min_price NUMERIC(10,2) NOT NULL,
    max_price NUMERIC(10,2) NOT NULL,
    modal_price NUMERIC(10,2) NOT NULL,
    arrival_date DATE NOT NULL,
    source VARCHAR(50) DEFAULT 'MP_EANUGYA',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_mandi_commodity_date UNIQUE (mandi_id, commodity_id, arrival_date)
);

CREATE TABLE IF NOT EXISTS slots (
    id BIGSERIAL PRIMARY KEY,
    mandi_id BIGINT NOT NULL REFERENCES mandis(id) ON DELETE CASCADE,
    slot_type VARCHAR(30) NOT NULL,
    item_name VARCHAR(100) NOT NULL DEFAULT 'General',
    slot_date DATE NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    total_capacity INT NOT NULL,
    booked_count INT NOT NULL DEFAULT 0,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT chk_capacity CHECK (booked_count <= total_capacity)
);

CREATE TABLE IF NOT EXISTS bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slot_id BIGINT NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
    booking_code VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED',
    booked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_slot UNIQUE (user_id, slot_id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    channel VARCHAR(20) NOT NULL DEFAULT 'SMS',
    status VARCHAR(20) NOT NULL DEFAULT 'SENT',
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-performance lookups
CREATE INDEX IF NOT EXISTS idx_mandi_prices_lookup ON mandi_prices (mandi_id, commodity_id, arrival_date);
CREATE INDEX IF NOT EXISTS idx_slots_lookup ON slots (mandi_id, slot_type, slot_date);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings (user_id);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users (phone);
