import DatabaseSchema from './DatabaseSchema';
import {
  Column,
  Constraint,
  ConstraintType,
  ForeignKey,
  Index,
  IndexType,
  Schema,
  Trigger, TriggerEvent, TriggerType,
  View
} from '../../../types/database';
import { Knex } from 'knex';
import Configs from '../../../configs';
import { parsePgArray } from '../../../utils';

class PostgreSQLDatabaseSchema implements DatabaseSchema {
  private dbInstance: Knex;

  constructor(dbInstance: Knex) {
    this.dbInstance = dbInstance;
  }

  async getTableNames(): Promise<string[]> {
    const sql = `
        SELECT table_name as "tableName"
        FROM information_schema.tables
        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
          AND table_type = 'BASE TABLE'
        ORDER BY table_schema, table_name;
    `;
    const { rows } = await this.dbInstance.raw(sql);
    return rows
      .map((r: any) => r.tableName as string)
      .filter((name: string) => !Configs.ignoreTables.includes(name));
  }

  async getViews(): Promise<View[]> {
    const sql = `
        SELECT
            v.relname AS "viewName",
            array_agg(DISTINCT t.relname::text) AS "tables"
        FROM pg_depend d
            JOIN pg_rewrite r ON r.oid = d.objid
            JOIN pg_class v ON v.oid = r.ev_class
            JOIN pg_class t ON t.oid = d.refobjid
        WHERE v.relkind IN ('v', 'm')   -- 'v' = view, 'm' = materialized view
            AND t.relkind IN ('r', 'p')   -- 'r' = table, 'p' = partitioned table
        GROUP BY v.relname
        ORDER BY v.relname;
    `;
    const { rows } = await this.dbInstance.raw(sql);
    return rows.map((r: any) => ({
      name: r.viewName,
      tables: parsePgArray(r.tables)
    }));
  }

  async getColumns(tableName: string): Promise<Column[]> {
    const sql = `
        WITH tbl AS (SELECT c.oid AS relid
            FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE n.nspname = 'public'
                AND c.relname = '${tableName}'
                AND c.relkind = 'r')
        SELECT ic.ordinal_position      AS "ordinalPosition",
               ic.column_name           AS "columnName",
               -- Base formatted type from pg_catalog (precise, includes lengths/precision)
               CASE
                   WHEN a.atttypid = 'real'::regtype                 THEN 'float4'
                   WHEN a.atttypid = 'double precision'::regtype     THEN 'float8'
                   WHEN a.atttypid = 'timestamp with time zone'::regtype THEN 'timestamptz'
                   WHEN a.atttypid = 'time with time zone'::regtype  THEN 'timetz'
                   WHEN a.atttypid = 'timestamp'::regtype            THEN 'timestamp' -- already compact
                   WHEN a.atttypid = 'time'::regtype                 THEN 'time' -- already compact
                   WHEN a.atttypid = 'character varying'::regtype THEN
                       -- convert "character varying(n)" to "varchar(n)"
                       regexp_replace(pg_catalog.format_type(a.atttypid, a.atttypmod), 
                                      '^character varying(.*)$', 'varchar\\1')
                   WHEN a.atttypid = 'character'::regtype THEN
                       -- convert "character(n)" to "char(n)"
                       regexp_replace(pg_catalog.format_type(a.atttypid, a.atttypmod),
                                                            '^character(.*)$', 'char\\1')
                   ELSE pg_catalog.format_type(a.atttypid, a.atttypmod)
                   END                  AS "dataType",

               (ic.is_nullable = 'YES') AS "nullable",
               ic.column_default        AS "defaultValue",
               STRING_AGG(cc.check_clause, ' AND ' ORDER BY tc.constraint_name)
                    FILTER (
                      WHERE cc.check_clause IS NOT NULL
                        AND ccu.column_name IS NOT NULL  -- only checks that involve this column
                    ) AS "predicate"
        FROM information_schema.columns ic
                 JOIN tbl ON true
                 JOIN pg_attribute a
                      ON a.attrelid = tbl.relid
                          AND a.attname = ic.column_name
                          AND a.attnum > 0
                          AND NOT a.attisdropped
                 LEFT JOIN information_schema.table_constraints tc
                           ON tc.table_schema = ic.table_schema
                               AND tc.table_name = ic.table_name
                               AND tc.constraint_type = 'CHECK'
                 LEFT JOIN information_schema.check_constraints cc
                           ON cc.constraint_schema = tc.constraint_schema
                               AND cc.constraint_name = tc.constraint_name
                 LEFT JOIN information_schema.constraint_column_usage ccu
                           ON ccu.constraint_schema = tc.constraint_schema
                               AND ccu.constraint_name = tc.constraint_name
                               AND ccu.table_schema = ic.table_schema
                               AND ccu.table_name = ic.table_name
                               AND ccu.column_name = ic.column_name
        WHERE ic.table_schema = 'public'
          AND ic.table_name = '${tableName}'
        GROUP BY ic.ordinal_position,
                 ic.column_name,
                 ic.is_nullable,
                 ic.column_default,
                 a.atttypid,
                 a.atttypmod
        ORDER BY ic.ordinal_position;
    `;
    const { rows } = await this.dbInstance.raw(sql);
    return rows.map((c: any) => ({
      name: c.columnName,
      dataType: c.dataType,
      nullable: !!c.nullable,
      predicate: c.predicate,
      defaultValue: c.defaultValue,

      // this will be filled in later
      partOf: []
    }));
  }

  async getConstraints(tableName: string): Promise<Constraint[]> {
    const sql = `
        WITH tbl AS (SELECT c.oid AS relid
                     FROM pg_class c
                              JOIN pg_namespace n ON n.oid = c.relnamespace
                     WHERE n.nspname = 'public'
                       AND c.relname = '${tableName}'
                       AND c.relkind IN ('r', 'p') -- ordinary or partitioned table
        )
        SELECT con.conname AS "constraintName",
               CASE con.contype
                   WHEN 'p' THEN '${ConstraintType.PRIMARY_KEY}'
                   WHEN 'u' THEN '${ConstraintType.UNIQUE}'
                   WHEN 'c' THEN '${ConstraintType.CHECK}'
                   WHEN 'x' THEN '${ConstraintType.EXCLUDE}'
                   WHEN 't' THEN '${ConstraintType.CONSTRAINT_TRIGGER}'
                   WHEN 'f' THEN '${ConstraintType.FOREIGN_KEY}'
                   ELSE con.contype::text
                   END     AS "constraintType",
               COALESCE(
                       (SELECT ARRAY(
                                   SELECT att.attname
        FROM unnest(con.conkey) WITH ORDINALITY AS k(attnum, ord)
        JOIN pg_attribute att
          ON att.attrelid = con.conrelid
         AND att.attnum   = k.attnum
        ORDER BY k.ord
      )), ARRAY[] ::text[]
               )           AS columns,
               CASE
                   WHEN con.contype = 'c' THEN
                       -- Strip leading 'CHECK (' and trailing ')'
                       regexp_replace(pg_get_constraintdef(con.oid, true), '^CHECK \\((.*)\\)$', '\\1')
                   WHEN con.contype = 'x' THEN
                       -- Extract trailing WHERE (...) if present; otherwise NULL
                       NULLIF(
                               regexp_replace(pg_get_constraintdef(con.oid, true), '^.* WHERE \\((.*)\\)$', '\\1'),
                               pg_get_constraintdef(con.oid, true)
                       )
                   ELSE NULL
                   END     AS predicate
        FROM pg_constraint con
                 JOIN tbl ON tbl.relid = con.conrelid
        ORDER BY "constraintType", "constraintName";
    `;
    const { rows } = await this.dbInstance.raw(sql);
    return rows.map((c: any) => ({
      name: c.constraintName,
      type: c.constraintType,
      columns: parsePgArray(c.columns),
      predicate: c.predicate
    }));
  }

  async getForeignKeys(tableName: string): Promise<ForeignKey[]> {
    const sql = `
        WITH tbl AS (
          SELECT c.oid AS relid
          FROM pg_class c
          JOIN pg_namespace n ON n.oid = c.relnamespace
          WHERE n.nspname = 'public' AND c.relname = '${tableName}' AND c.relkind IN ('r','p')
        )
        SELECT
          con.conname AS name,
          COALESCE((
            SELECT ARRAY(
              SELECT att.attname
              FROM unnest(con.conkey) WITH ORDINALITY AS k(attnum, ord)
              JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = k.attnum
              ORDER BY k.ord
            )
          ), ARRAY[]::text[]) AS columns,
          nsp_ref.nspname AS ref_table_schema,
          rel_ref.relname AS "referencedTable",
          COALESCE((
            SELECT ARRAY(
              SELECT attref.attname
              FROM unnest(con.confkey) WITH ORDINALITY AS k2(attnum, ord)
              JOIN pg_attribute attref ON attref.attrelid = con.confrelid AND attref.attnum = k2.attnum
              ORDER BY k2.ord
            )
          ), ARRAY[]::text[]) AS "referencedColumns",
          con.confupdtype AS on_update_action_code,
          CASE con.confupdtype
            WHEN 'a' THEN 'NO ACTION'
            WHEN 'r' THEN 'RESTRICT'
            WHEN 'c' THEN 'CASCADE'
            WHEN 'n' THEN 'SET NULL'
            WHEN 'd' THEN 'SET DEFAULT'
            ELSE con.confupdtype::text
          END AS "onUpdateAction",
          con.confdeltype AS on_delete_action_code,
          CASE con.confdeltype
            WHEN 'a' THEN 'NO ACTION'
            WHEN 'r' THEN 'RESTRICT'
            WHEN 'c' THEN 'CASCADE'
            WHEN 'n' THEN 'SET NULL'
            WHEN 'd' THEN 'SET DEFAULT'
            ELSE con.confdeltype::text
          END AS "onDeleteAction",
          con.confmatchtype AS match_type_code,
          CASE con.confmatchtype
            WHEN 's' THEN 'SIMPLE'
            WHEN 'f' THEN 'FULL'
            WHEN 'p' THEN 'PARTIAL'
            ELSE con.confmatchtype::text
          END AS match_type,
          con.condeferrable AS is_deferrable,
          con.condeferred   AS initially_deferred
        FROM pg_constraint con
        JOIN tbl ON tbl.relid = con.conrelid
        LEFT JOIN pg_class rel_ref     ON rel_ref.oid = con.confrelid
        LEFT JOIN pg_namespace nsp_ref ON nsp_ref.oid = rel_ref.relnamespace
        WHERE con.contype = 'f'
        ORDER BY name;
    `;

    const { rows } = await this.dbInstance.raw(sql);
    return rows.map((c: any) => ({
      name: c.name,
      columns: parsePgArray(c.columns),
      referencedTable: c.referencedTable,
      referencedColumns: parsePgArray(c.referencedColumns),
      onUpdateAction: c.onUpdateAction,
      onDeleteAction: c.onDeleteAction
    }));
  }

  async getIndexes(tableName: string): Promise<Index[]> {
    const sql = `
        SELECT
          ci.relname AS "indexName",
          CASE
            WHEN i.indisunique AND i.indpred IS NOT NULL THEN '${IndexType.UNIQUE_PARTIAL_INDEX}'
            WHEN i.indisunique THEN '${IndexType.UNIQUE_INDEX}'
            WHEN i.indpred IS NOT NULL THEN '${IndexType.PARTIAL_INDEX}'
            ELSE '${IndexType.REGULAR_INDEX}'
          END AS "indexType",
          am.amname AS method,
          i.indisprimary AS "isPrimary",
          i.indisunique  AS "isUnique",
          (i.indpred IS NOT NULL) AS "isPartial",
        
          COALESCE(cols.columns, ARRAY[]::text[]) AS columns,
        
          ARRAY(
            SELECT pg_get_indexdef(i.indexrelid, k, TRUE)
            FROM generate_series(1, i.indnkeyatts) AS k
            ORDER BY k
          )::text[] AS key_columns,
        
          ARRAY(
            SELECT pg_get_indexdef(i.indexrelid, k, TRUE)
            FROM generate_series(i.indnkeyatts + 1, i.indnatts) AS k
            ORDER BY k
          )::text[] AS include_columns,
        
          pg_get_expr(i.indpred, i.indrelid) AS predicate,
        
          EXISTS (
            SELECT 1
            FROM generate_series(1, i.indnkeyatts) AS k
            WHERE pg_get_indexdef(i.indexrelid, k, TRUE) ~ '\\('
          ) AS has_expression_keys
        
        FROM pg_index i
        JOIN pg_class     ct ON ct.oid = i.indrelid
        JOIN pg_namespace nt ON nt.oid = ct.relnamespace
        JOIN pg_class     ci ON ci.oid = i.indexrelid
        JOIN pg_am        am ON am.oid = ci.relam
        
        LEFT JOIN LATERAL (
          WITH
            table_cols AS (
              SELECT att.attname AS col
              FROM pg_attribute att
              WHERE att.attrelid = i.indrelid
                AND att.attnum > 0
                AND NOT att.attisdropped
            ),
            keydefs AS (
              SELECT k AS ord, pg_get_indexdef(i.indexrelid, k, TRUE) AS keydef
              FROM generate_series(1, i.indnkeyatts) AS k
            ),
            matches AS (
              -- regexp_matches returns text[] -> take the first element with [1]
              SELECT kd.ord,
                     (regexp_matches(kd.keydef, '([A-Za-z_][A-Za-z0-9_]*)', 'g'))[1] AS raw_token
              FROM keydefs kd
            ),
            norm AS (
              -- strip quotes and reduce a.b.c -> last part
              SELECT ord,
                     (
                       string_to_array(replace(raw_token, '"', ''), '.')
                     )[ array_upper(string_to_array(replace(raw_token, '"', ''), '.'), 1) ] AS base_name
              FROM matches
              WHERE raw_token IS NOT NULL
            ),
            filtered AS (
              SELECT ord, base_name AS name
              FROM norm
              WHERE EXISTS (
                SELECT 1 FROM table_cols tc WHERE lower(tc.col) = lower(norm.base_name)
              )
            ),
            ranked AS (
              SELECT name, MIN(ord) AS first_ord
              FROM filtered
              GROUP BY name
            )
          SELECT COALESCE(
            ARRAY(
              SELECT name
              FROM ranked
              ORDER BY first_ord
            )::text[],
            ARRAY[]::text[]
          ) AS columns
        ) AS cols ON TRUE
        
        WHERE nt.nspname = 'public'
          AND ct.relname = '${tableName}'
        ORDER BY i.indisprimary DESC, i.indisunique DESC, ci.relname;
    `;
    const { rows } = await this.dbInstance.raw(sql);
    return rows.map((c: any) => ({
      name: c.indexName,
      type: c.indexType,
      columns: parsePgArray(c.columns),
      predicate: c.predicate,
      isPrimary: c.isPrimary,
      isUnique: c.isUnique,
      isPartial: c.isPartial
    }));
  }

  async getTriggers(tableName: string): Promise<Trigger[]> {
    const sql = `
        SELECT
            t.tgname AS "triggerName",
            CASE
                WHEN t.tgtype & 66 = 66 THEN '${TriggerType.INSTEAD_OF}'
                WHEN t.tgtype & 64 = 64 THEN '${TriggerType.BEFORE}'
                ELSE '${TriggerType.AFTER}'
            END AS "triggerType",
            array_remove(ARRAY[
                CASE WHEN t.tgtype & 4 = 4 THEN '${TriggerEvent.INSERT}' END,
                CASE WHEN t.tgtype & 8 = 8 THEN '${TriggerEvent.DELETE}' END,
                CASE WHEN t.tgtype & 16 = 16 THEN '${TriggerEvent.UPDATE}' END,
                CASE WHEN t.tgtype & 32 = 32 THEN '${TriggerEvent.TRUNCATE}' END
            ], NULL) AS "triggerEvent",
            COALESCE(array_agg(a.attname ORDER BY a.attnum), '{}'::text[]) AS columns
        FROM pg_trigger t
                 JOIN pg_class c ON c.oid = t.tgrelid
                 JOIN pg_namespace n ON n.oid = c.relnamespace
                 LEFT JOIN pg_attribute a
                           ON a.attrelid = c.oid
                               AND a.attnum = ANY(t.tgattr)  -- map column numbers to names
        WHERE n.nspname = 'public'         -- schema
          AND c.relname = '${tableName}'   -- table
          AND NOT t.tgisinternal           -- exclude internal triggers
        GROUP BY t.tgname, t.tgtype
        ORDER BY t.tgname;
      `;
    const { rows } = await this.dbInstance.raw(sql);
    return rows.map((r: any) => ({
      name: r.triggerName,
      type: r.triggerType,
      event: parsePgArray(r.triggerEvent),
      columns: parsePgArray(r.columns)
    }));
  }

  getEnrichedColumns(
    columns: Column[],
    constraintsAndIndexes: { type: string, columns: string[] }[]
  ): Column[] {
    const columnNamesAndPartOfMap: Record<string, Set<string>> = {};
    constraintsAndIndexes.forEach((ci: {type: string, columns: string[]}) => {
      ci.columns.forEach(columnName => {
        if (columnNamesAndPartOfMap[columnName]) {
          columnNamesAndPartOfMap[columnName].add(ci.type);
        } else {
          columnNamesAndPartOfMap[columnName] = new Set([ci.type]);
        }
      });
    });
    return columns.map(column => {
      column.partOf = Array.from(columnNamesAndPartOfMap[column.name] || []);
      return column;
    });
  }

  async getSchema(): Promise<Schema> {
    const tableNames = await this.getTableNames();
    const views = await this.getViews();
    const triggersOfAllTables = await Promise.all(
      tableNames.map(tableName => this.getTriggers(tableName))
    );
    const columnsOfAllTables = await Promise.all(
      tableNames.map(tableName => this.getColumns(tableName))
    );
    const constraintsOfAllTables = await Promise.all(
      tableNames.map(tableName => this.getConstraints(tableName))
    );
    const foreignKeysOfAllTable = await Promise.all(
      tableNames.map(tableName => this.getForeignKeys(tableName))
    );
    const indexesOfAllTables = await Promise.all(
      tableNames.map(tableName => this.getIndexes(tableName))
    );
    const enrichedTables = tableNames.map((name, index) => {
      const columns = columnsOfAllTables[index];
      const constraints = constraintsOfAllTables[index];
      const foreignKeys = foreignKeysOfAllTable[index];
      const indexes = indexesOfAllTables[index];
      const triggers = triggersOfAllTables[index];

      const enrichedColumns = this.getEnrichedColumns(
        columns,
        [...constraints, ...indexes]
      );

      return { name, columns: enrichedColumns, constraints, foreignKeys, indexes, triggers };
    });

    return {
      tables: enrichedTables,
      views
    };
  }
}

export default PostgreSQLDatabaseSchema;
