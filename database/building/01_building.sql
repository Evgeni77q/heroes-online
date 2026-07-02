-- =========================================================
-- Heroes Online
-- Building Domain - PostgreSQL Schema
-- File: database/building/01_building.sql
-- Version: 1.0
-- =========================================================

DO $$ BEGIN
    CREATE TYPE building_type AS ENUM (
        'LUMBER_MILL',
        'QUARRY',
        'MINE',
        'FARM',
        'MARKET'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS buildings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES cities(id),
    type building_type NOT NULL,
    level INT NOT NULL DEFAULT 1,
    is_under_construction BOOLEAN NOT NULL DEFAULT FALSE,
    finish_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_buildings_city_id ON buildings (city_id);

DROP TRIGGER IF EXISTS trg_buildings_updated_at ON buildings;

CREATE TRIGGER trg_buildings_updated_at
BEFORE UPDATE ON buildings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
