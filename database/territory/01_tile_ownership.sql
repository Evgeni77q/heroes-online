-- =========================================================
-- Heroes Online
-- Territory Domain - Tile ownership migration
-- File: database/territory/01_tile_ownership.sql
-- Version: 1.0
-- =========================================================

-- Migrate legacy owner_id column if present
DO $$ BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'tiles' AND column_name = 'owner_id'
    ) THEN
        ALTER TABLE tiles RENAME COLUMN owner_id TO owner_city_id;
    END IF;
END $$;

-- Add owner_city_id if missing (fresh installs may already have it)
ALTER TABLE tiles
    ADD COLUMN IF NOT EXISTS owner_city_id UUID NULL;

DROP INDEX IF EXISTS ix_tiles_owner_id;
CREATE INDEX IF NOT EXISTS ix_tiles_owner_city_id ON tiles (owner_city_id);

DO $$ BEGIN
    ALTER TABLE tiles
        ADD CONSTRAINT fk_tiles_owner_city
        FOREIGN KEY (owner_city_id) REFERENCES cities(id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
