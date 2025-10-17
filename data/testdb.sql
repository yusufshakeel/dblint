-- Enable useful extensions (safe/no-op if already present)
CREATE EXTENSION IF NOT EXISTS pgcrypto;     -- for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS btree_gist;   -- for exclusion constraints on non-range types

-- Optional: a small lookup table to demonstrate a foreign key
CREATE TABLE IF NOT EXISTS user_group (
  id          smallserial PRIMARY KEY,
  code        text NOT NULL UNIQUE,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Optional: an enum type example
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mood') THEN
CREATE TYPE mood AS ENUM ('happy', 'ok', 'sad');
END IF;
END$$;

-- Main demo table
CREATE TABLE IF NOT EXISTS all_types_demo (
    -- Identity primary key
    id                  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- UUID with default
    public_id           uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,

    -- Foreign key
    group_id            smallint REFERENCES user_group(id) ON DELETE SET NULL,

    -- Strings
    username            varchar(32)  NOT NULL,
    email               citext       NOT NULL,    -- requires citext extension if you choose to use it; alternatively use text
    display_name        text,
    fixed_char          char(5)      NOT NULL DEFAULT 'abc  ',

    -- Numbers
    tiny_count          smallint     NOT NULL DEFAULT 0,
    count_num           integer      NOT NULL,
    big_count           bigint       NOT NULL,
    price               numeric(12,2) NOT NULL DEFAULT 0.00,
    ratio               real,
    score               double precision,

    -- Booleans
    is_active           boolean      NOT NULL DEFAULT true,

    -- Dates and times
    created_at          timestamptz  NOT NULL DEFAULT now(),
    updated_at          timestamptz  NOT NULL DEFAULT now(),
    archived_at         timestamptz,
    born_on             date,
    wake_time           timetz,
    duration            interval,

    -- Network types
    ip_addr             inet,
    network_block       cidr,
    mac_address         macaddr,

    -- JSON / arrays / ranges
    settings            jsonb         NOT NULL DEFAULT '{}'::jsonb,
    tags                text[]        NOT NULL DEFAULT '{}',
    scores              integer[]     NOT NULL DEFAULT '{}',
    availability        tstzrange,
    int_range           int4range,

    -- Full text and enum
    bio                 text,
    bio_tsv             tsvector      GENERATED ALWAYS AS (to_tsvector('simple', coalesce(bio, ''))) STORED,
    mood                mood,

    -- Money and UUID-ish extras
    pocket_money        money,

    -- Generated column example
    full_name           text          GENERATED ALWAYS AS (coalesce(display_name, username)) STORED,

    -- Constraints at column or table level
    CONSTRAINT uq_username UNIQUE (username),
    CONSTRAINT ck_price_nonnegative CHECK (price >= 0),
    CONSTRAINT ck_username_valid CHECK (username ~ '^[a-zA-Z0-9_]+$'),
    CONSTRAINT ck_scores_small CHECK (array_length(scores, 1) IS NULL OR array_length(scores, 1) <= 100)
);

-- Optional: case-insensitive email unique. If you prefer `citext`, ensure the extension:
-- CREATE EXTENSION IF NOT EXISTS citext;
-- For pure text emails, you could enforce unique(lower(email)) via a unique index below.

-- Composite unique (example): username + group_id must be unique among active rows
-- Implement as a partial unique index so it only applies when not archived
CREATE UNIQUE INDEX IF NOT EXISTS uq_user_group_active
    ON all_types_demo (username, group_id)
    WHERE archived_at IS NULL;

-- Simple btree indexes
CREATE INDEX IF NOT EXISTS idx_all_types_demo_created_at
    ON all_types_demo (created_at);

CREATE INDEX IF NOT EXISTS idx_all_types_demo_price
    ON all_types_demo (price);

-- Partial index (filters soft-deleted/archived rows)
CREATE INDEX IF NOT EXISTS idx_all_types_demo_active
    ON all_types_demo (is_active)
    WHERE archived_at IS NULL;

-- Unique partial index on email for non-archived rows (case-insensitive using lower())
CREATE UNIQUE INDEX IF NOT EXISTS uq_all_types_demo_email_active
    ON all_types_demo ((lower(email::text)))
    WHERE archived_at IS NULL;

-- GIN index for JSONB
CREATE INDEX IF NOT EXISTS idx_all_types_demo_settings_gin
    ON all_types_demo USING gin (settings jsonb_path_ops);

-- GIN index for full-text search
CREATE INDEX IF NOT EXISTS idx_all_types_demo_bio_tsv
    ON all_types_demo USING gin (bio_tsv);

-- BRIN index for time-series style queries
CREATE INDEX IF NOT EXISTS idx_all_types_demo_created_at_brin
    ON all_types_demo USING brin (created_at);

-- Exclusion constraint: prevent overlapping availability per user (by public_id)
-- Requires btree_gist; uses GIST to exclude overlapping ranges for same public_id
ALTER TABLE all_types_demo
    ADD CONSTRAINT ex_no_overlap_availability
    EXCLUDE USING gist (
    public_id WITH =,
    availability WITH &&
  ) WHERE (availability IS NOT NULL);

-- A couple of helpful comments
COMMENT ON TABLE all_types_demo IS 'Demonstrates many PostgreSQL types, constraints, and indexes.';
COMMENT ON COLUMN all_types_demo.public_id IS 'Public-facing UUID for external references.';
COMMENT ON COLUMN all_types_demo.settings IS 'JSONB settings with a GIN index.';

-- Trigger to maintain updated_at (optional)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
RETURN NEW;
END$$;

DROP TRIGGER IF EXISTS trg_set_updated_at ON all_types_demo;
CREATE TRIGGER trg_set_updated_at
    BEFORE UPDATE ON all_types_demo
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- View
CREATE OR REPLACE VIEW v_all_types_demo_active AS
SELECT
    a.id,
    a.public_id,
    a.username,
    a.email,
    lower(a.email::text) AS email_lower,
    a.display_name,
    a.full_name,
    a.group_id,
    g.code AS group_code,
    a.is_active,
    a.created_at,
    a.updated_at,
    a.price,
    a.settings,
    a.tags,
    array_length(a.scores, 1) AS scores_count,
    a.bio,
    a.bio_tsv
FROM all_types_demo a
         LEFT JOIN user_group g ON g.id = a.group_id
WHERE a.archived_at IS NULL AND a.is_active = true;
