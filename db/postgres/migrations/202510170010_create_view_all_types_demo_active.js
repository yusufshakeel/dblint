/**
 * Knex migration: create view v_all_types_demo_active (PostgreSQL)
 *
 * - Depends on tables: user_group, all_types_demo
 * - Creates a simple read-only view for active, non-archived rows with a helpful projection
 */

/** @param {import('knex').Knex} knex */
exports.up = async function up(knex) {
    // Use OR REPLACE so re-running (in dev) won’t fail if the view already exists
    await knex.raw(`
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
  `);
};

/** @param {import('knex').Knex} knex */
exports.down = async function down(knex) {
    await knex.raw(`DROP VIEW IF EXISTS v_all_types_demo_active`);
};
