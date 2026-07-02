-- =========================================================
-- Heroes Online
-- Resource Domain - PostgreSQL Schema
-- File: database/resource/01_resource.sql
-- Version: 1.0
-- =========================================================

DO $$ BEGIN
    CREATE TYPE resource_type AS ENUM (
        'WOOD',
        'STONE',
        'IRON',
        'FOOD',
        'GOLD'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS resource_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL REFERENCES cities(id),
    type resource_type NOT NULL,
    amount INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (city_id, type)
);

CREATE INDEX IF NOT EXISTS ix_resource_balances_city_id ON resource_balances (city_id);

DROP TRIGGER IF EXISTS trg_resource_balances_updated_at ON resource_balances;

CREATE TRIGGER trg_resource_balances_updated_at
BEFORE UPDATE ON resource_balances
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
