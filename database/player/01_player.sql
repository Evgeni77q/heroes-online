-- =========================================================
-- Heroes Online
-- Player Domain - PostgreSQL Schema
-- File: database/player/01_player.sql
-- Version: 1.0
-- =========================================================

CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id),
    name VARCHAR(20) NOT NULL,
    world_id UUID NOT NULL REFERENCES worlds(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_players_account_id ON players (account_id);
CREATE INDEX IF NOT EXISTS ix_players_world_id ON players (world_id);

DROP TRIGGER IF EXISTS trg_players_updated_at ON players;

CREATE TRIGGER trg_players_updated_at
BEFORE UPDATE ON players
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
