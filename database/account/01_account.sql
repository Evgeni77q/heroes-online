-- =========================================================
-- Heroes Online
-- Account Domain - PostgreSQL Schema
-- File: database/account/01_account.sql
-- Version: 1.0
-- =========================================================

-- Enable UUID generation (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================
-- ENUM: account_status
-- =========================================================

DO $$ BEGIN
    CREATE TYPE account_status AS ENUM (
        'pending_verification',
        'active',
        'locked',
        'suspended',
        'deleted'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =========================================================
-- TABLE: accounts
-- =========================================================

CREATE TABLE IF NOT EXISTS accounts (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Core identity
    email VARCHAR(255) NOT NULL,
    username VARCHAR(24) NOT NULL,

    -- Authentication
    password_hash TEXT NOT NULL,

    -- Status
    status account_status NOT NULL DEFAULT 'pending_verification',

    -- Verification
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    email_verified_at TIMESTAMPTZ NULL,

    -- Security
    failed_login_attempts INT NOT NULL DEFAULT 0,
    last_login_at TIMESTAMPTZ NULL,
    last_login_ip INET NULL,
    locked_until TIMESTAMPTZ NULL,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,

    -- Lifecycle
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

-- =========================================================
-- CONSTRAINTS
-- =========================================================

-- Email format constraint (basic)
ALTER TABLE accounts
    ADD CONSTRAINT chk_accounts_email_format
    CHECK (position('@' in email) > 1);

-- Username rules (basic validation)
ALTER TABLE accounts
    ADD CONSTRAINT chk_accounts_username_length
    CHECK (char_length(username) BETWEEN 3 AND 24);

-- Prevent invalid status transitions at DB level (soft guard)
ALTER TABLE accounts
    ADD CONSTRAINT chk_accounts_not_deleted_active
    CHECK (NOT (status = 'active' AND deleted_at IS NOT NULL));

-- =========================================================
-- UNIQUE INDEXES
-- =========================================================

CREATE UNIQUE INDEX IF NOT EXISTS ux_accounts_email
    ON accounts (lower(email));

CREATE UNIQUE INDEX IF NOT EXISTS ux_accounts_username
    ON accounts (lower(username));

-- =========================================================
-- PERFORMANCE INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS ix_accounts_status
    ON accounts (status);

CREATE INDEX IF NOT EXISTS ix_accounts_created_at
    ON accounts (created_at);

CREATE INDEX IF NOT EXISTS ix_accounts_last_login_at
    ON accounts (last_login_at);

-- =========================================================
-- SECURITY INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS ix_accounts_email_lookup
    ON accounts (email);

-- =========================================================
-- UPDATED_AT TRIGGER
-- =========================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_accounts_updated_at ON accounts;

CREATE TRIGGER trg_accounts_updated_at
BEFORE UPDATE ON accounts
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- NOTES
-- =========================================================

-- 1. Passwords are NEVER stored in plaintext.
-- 2. All authentication logic is handled in backend service.
-- 3. Database enforces only structural integrity, not business logic.
-- 4. Soft delete is used instead of hard delete.
-- 5. Email/username uniqueness is case-insensitive via lower() index.
--
-- =========================================================
