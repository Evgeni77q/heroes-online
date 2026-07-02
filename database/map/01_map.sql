-- =========================================================
-- Heroes Online
-- Map Domain - PostgreSQL Schema
-- File: database/map/01_map.sql
-- Version: 1.0
-- =========================================================

DO $$ BEGIN
    CREATE TYPE tile_type AS ENUM (
        'PLAINS',
        'FOREST',
        'MOUNTAIN',
        'WATER',
        'DESERT',
        'SWAMP'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS maps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    world_id UUID NOT NULL REFERENCES worlds(id),
    width INT NOT NULL,
    height INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_maps_world_id ON maps (world_id);

CREATE TABLE IF NOT EXISTS tiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    map_id UUID NOT NULL REFERENCES maps(id),
    x INT NOT NULL,
    y INT NOT NULL,
    type tile_type NOT NULL,
    owner_city_id UUID NULL,
    has_city BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (map_id, x, y)
);

CREATE INDEX IF NOT EXISTS ix_tiles_map_id ON tiles (map_id);
CREATE INDEX IF NOT EXISTS ix_tiles_owner_city_id ON tiles (owner_city_id);
