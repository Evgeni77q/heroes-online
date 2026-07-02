-- =========================================================
-- Heroes Online
-- City Domain - PostgreSQL Schema
-- File: database/city/01_city.sql
-- Version: 1.0
-- =========================================================

CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id),
    world_id UUID NOT NULL REFERENCES worlds(id),
    map_id UUID NOT NULL REFERENCES maps(id),
    tile_id UUID NOT NULL UNIQUE REFERENCES tiles(id),
    name VARCHAR(24) NOT NULL,
    level INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_cities_player_id ON cities (player_id);
CREATE INDEX IF NOT EXISTS ix_cities_world_id ON cities (world_id);

DROP TRIGGER IF EXISTS trg_cities_updated_at ON cities;

CREATE TRIGGER trg_cities_updated_at
BEFORE UPDATE ON cities
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
