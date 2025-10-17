/**
 * Knex migration: all_types_demo (PostgreSQL)
 *
 * Notes:
 * - Requires PostgreSQL. Uses extensions: pgcrypto, btree_gist, citext (for `email`).
 * - Uses raw DDL for PostgreSQL-specific features (generated columns, partial/unique-partial indexes,
 *   exclusion constraint, comments, trigger function).
 */

/** @param {import('knex').Knex} knex */
exports.up = async function up(knex) {
  // Enable useful extensions (idempotent)
  await knex.raw('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  await knex.raw('CREATE EXTENSION IF NOT EXISTS btree_gist');
  await knex.raw('CREATE EXTENSION IF NOT EXISTS citext');

  // Optional: enum type `mood`
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mood') THEN
        CREATE TYPE mood AS ENUM ('happy', 'ok', 'sad');
      END IF;
    END$$;
  `);

  // Lookup table: user_group
  await knex.schema.createTable('user_group', t => {
    t.specificType('id', 'smallserial').primary();
    t.text('code').notNullable().unique();
    t.specificType('created_at', 'timestamptz').notNullable().defaultTo(knex.fn.now());
  });

  // Main table: all_types_demo
  await knex.schema.createTable('all_types_demo', t => {
    // Identity primary key
    t.specificType('id', 'bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY');

    // UUID with default
    t.specificType('public_id', 'uuid').notNullable().defaultTo(knex.raw('gen_random_uuid()')).unique();

    // Foreign key
    t.specificType('group_id', 'smallint').references('user_group.id').onDelete('SET NULL');

    // Strings
    t.string('username', 32).notNullable();
    t.specificType('email', 'citext').notNullable();
    t.text('display_name');
    t.specificType('fixed_char', 'char(5)').notNullable().defaultTo('abc  ');

    // Numbers
    t.specificType('tiny_count', 'smallint').notNullable().defaultTo(0);
    t.integer('count_num').notNullable();
    t.specificType('big_count', 'bigint').notNullable();
    t.specificType('price', 'numeric(12,2)').notNullable().defaultTo('0.00');
    t.specificType('ratio', 'real');
    t.specificType('score', 'double precision');

    // Booleans
    t.boolean('is_active').notNullable().defaultTo(true);

    // Dates/times
    t.specificType('created_at', 'timestamptz').notNullable().defaultTo(knex.fn.now());
    t.specificType('updated_at', 'timestamptz').notNullable().defaultTo(knex.fn.now());
    t.specificType('archived_at', 'timestamptz');
    t.date('born_on');
    t.specificType('wake_time', 'timetz');
    t.specificType('duration', 'interval');

    // Network types
    t.specificType('ip_addr', 'inet');
    t.specificType('network_block', 'cidr');
    t.specificType('mac_address', 'macaddr');

    // JSON / arrays / ranges
    t.specificType('settings', 'jsonb').notNullable().defaultTo(knex.raw("'{}'::jsonb"));
    t.specificType('tags', 'text[]').notNullable().defaultTo(knex.raw("'{}'"));
    t.specificType('scores', 'integer[]').notNullable().defaultTo(knex.raw("'{}'"));
    t.specificType('availability', 'tstzrange');
    t.specificType('int_range', 'int4range');

    // Text search + enum
    t.text('bio');
    // generated tsvector column
    t.specificType(
      'bio_tsv',
      "tsvector GENERATED ALWAYS AS (to_tsvector('simple', coalesce(bio, ''))) STORED"
    );
    t.specificType('mood', 'mood');

    // Money
    t.specificType('pocket_money', 'money');

    // Another generated column
    t.specificType('full_name', 'text GENERATED ALWAYS AS (coalesce(display_name, username)) STORED');

    // Unique on username (named constraint)
    t.unique(['username'], { indexName: 'uq_username' });
  });

  // Additional constraints via raw (CHECKs)
  await knex.raw(`
    ALTER TABLE all_types_demo
      ADD CONSTRAINT ck_price_nonnegative CHECK (price >= 0),
      ADD CONSTRAINT ck_username_valid CHECK (username ~ '^[a-zA-Z0-9_]+$'),
      ADD CONSTRAINT ck_scores_small CHECK (array_length(scores, 1) IS NULL OR array_length(scores, 1) <= 100);
  `);

  // Composite unique as partial unique index (username + group_id) when not archived
  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS uq_user_group_active
      ON all_types_demo (username, group_id)
      WHERE archived_at IS NULL;
  `);

  // Simple btree indexes
  await knex.raw(`CREATE INDEX IF NOT EXISTS idx_all_types_demo_created_at ON all_types_demo (created_at);`);
  await knex.raw(`CREATE INDEX IF NOT EXISTS idx_all_types_demo_price ON all_types_demo (price);`);

  // Partial index on is_active for non-archived rows
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_all_types_demo_active
      ON all_types_demo (is_active)
      WHERE archived_at IS NULL;
  `);

  // Unique partial index on lower(email) for non-archived rows
  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS uq_all_types_demo_email_active
      ON all_types_demo ((lower(email::text)))
      WHERE archived_at IS NULL;
  `);

  // GIN indexes
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_all_types_demo_settings_gin
      ON all_types_demo USING gin (settings jsonb_path_ops);
  `);
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_all_types_demo_bio_tsv
      ON all_types_demo USING gin (bio_tsv);
  `);

  // BRIN index
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_all_types_demo_created_at_brin
      ON all_types_demo USING brin (created_at);
  `);

  // Exclusion constraint to avoid overlapping availability for same public_id (requires btree_gist)
  await knex.raw(`
    ALTER TABLE all_types_demo
      ADD CONSTRAINT ex_no_overlap_availability
      EXCLUDE USING gist (
        public_id WITH =,
        availability WITH &&
      ) WHERE (availability IS NOT NULL);
  `);

  // Comments
  await knex.raw(`COMMENT ON TABLE all_types_demo IS 'Demonstrates many PostgreSQL types, constraints, and indexes.'`);
  await knex.raw(`COMMENT ON COLUMN all_types_demo.public_id IS 'Public-facing UUID for external references.'`);
  await knex.raw(`COMMENT ON COLUMN all_types_demo.settings IS 'JSONB settings with a GIN index.'`);

  // Trigger to maintain updated_at
  await knex.raw(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      NEW.updated_at := now();
      RETURN NEW;
    END$$;
  `);

  await knex.raw(`DROP TRIGGER IF EXISTS trg_set_updated_at ON all_types_demo`);
  await knex.raw(`
    CREATE TRIGGER trg_set_updated_at
    BEFORE UPDATE ON all_types_demo
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  `);
};

/** @param {import('knex').Knex} knex */
exports.down = async function down(knex) {
  // Drop trigger and function
  await knex.raw(`DROP TRIGGER IF EXISTS trg_set_updated_at ON all_types_demo`);
  await knex.raw(`DROP FUNCTION IF EXISTS set_updated_at()`);

  // Drop main table (cascades its indexes/constraints)
  await knex.schema.dropTableIfExists('all_types_demo');

  // Drop enum type
  await knex.raw(`DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mood') THEN DROP TYPE mood; END IF; END$$;`);

  // Drop lookup table
  await knex.schema.dropTableIfExists('user_group');

  // Optionally keep extensions, but you can drop if you wish (commented out):
  await knex.raw('DROP EXTENSION IF EXISTS citext');
  await knex.raw('DROP EXTENSION IF EXISTS btree_gist');
  await knex.raw('DROP EXTENSION IF EXISTS pgcrypto');
};
