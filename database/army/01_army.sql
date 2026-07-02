-- =========================================================
-- Heroes Online
-- Army Domain - PostgreSQL Schema
-- File: database/army/01_army.sql
-- Version: 1.0
-- =========================================================

DO $$ BEGIN
    CREATE TYPE unit_type AS ENUM (
        'INFANTRY',
        'ARCHER',
        'CAVALRY'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS armies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES cities(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_armies_city_id ON armies (city_id);

DROP TRIGGER IF EXISTS trg_armies_updated_at ON armies;

CREATE TRIGGER trg_armies_updated_at
BEFORE UPDATE ON armies
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    army_id UUID NOT NULL REFERENCES armies(id),
    type unit_type NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (army_id, type)
);

DROP TRIGGER IF EXISTS trg_units_updated_at ON units;

CREATE TRIGGER trg_units_updated_at
BEFORE UPDATE ON units
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
