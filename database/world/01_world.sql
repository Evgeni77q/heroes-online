-- =========================================================
-- Heroes Online
-- World Domain - PostgreSQL Schema
-- File: database/world/01_world.sql
-- Version: 1.0
-- =========================================================

DO $$ BEGIN
    CREATE TYPE world_status AS ENUM (
        'ACTIVE',
        'MAINTENANCE',
        'CLOSED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS worlds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(32) NOT NULL,
    description TEXT NULL,
    status world_status NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_worlds_status ON worlds (status);

DROP TRIGGER IF EXISTS trg_worlds_updated_at ON worlds;

CREATE TRIGGER trg_worlds_updated_at
BEFORE UPDATE ON worlds
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
