import { DatabaseType } from '../types/database';
import { CaseTypeOfIdentifiers, MaxLengthOfIdentifiers } from '../types/lint';
import { CaseType } from '../types/case-type';

/**
 * Central configuration accessor for dblint.
 *
 * This class aggregates all configuration values used by the linter. Each setting can be
 * provided programmatically via its setter or read from environment variables. Getters always
 * return a concrete value (using sensible defaults) so callers do not need to handle undefined.
 *
 * Usage example:
 * ```ts
 *   import Configs from './configs';
 *   Configs.dbType = DatabaseType.postgres; // set programmatically
 *   const port = Configs.dbPort; // reads configured value or env or default
 * ```
 */
class Configs {
  private configDbType: DatabaseType | undefined;
  private configDbName: string | undefined;
  private configDbUser: string | undefined;
  private configDbPassword: string | undefined;
  private configDbHost: string | undefined;
  private configDbPort: number | undefined;
  private configIgnoreTables: string[] | undefined;
  private configDefaultMaxLengthOfIdentifiers: number | undefined;
  private configMaxLengthOfIdentifiers: MaxLengthOfIdentifiers | undefined;
  private configDefaultCaseTypeOfIdentifiers: CaseType | undefined;
  private configCaseTypeOfIdentifiers: CaseTypeOfIdentifiers | undefined;
  private configCustomTableNames: Record<string, string> | undefined;
  private configCustomViewNames: Record<string, string> | undefined;
  private configCustomColumnNames: Record<string, Record<string, string>> | undefined;
  private configCustomConstraintNames: Record<string, Record<string, string>> | undefined;
  private configCustomIndexNames: Record<string, Record<string, string>> | undefined;
  private configCustomTriggerNames: Record<string, Record<string, string>> | undefined;
  private configCustomForeignKeyNames: Record<string, Record<string, string>> | undefined;
  private configIgnoreValidationErrors: Record<string, Record<string, string>> | undefined;

  /**
   * Set the database type to use.
   *
   * @param dbType The database dialect. If undefined, getter will fall back to env or default.
   */
  set dbType(dbType: DatabaseType | undefined) {
    this.configDbType = dbType;
  }
  /**
   * Get the database type.
   *
   * Order of resolution: configured value > process.env.DBLINT_DATABASE_TYPE > DatabaseType.postgres
   *
   * @returns The effective database type.
   */
  get dbType(): DatabaseType {
    return (
        this.configDbType ||
        process.env.DBLINT_DATABASE_TYPE ||
        DatabaseType.postgres
    ) as DatabaseType;
  }

  /**
   * Set the database name.
   *
   * @param dbName Database/schema name. If undefined, getter falls back to env or empty string.
   */
  set dbName(dbName: string | undefined) {
    this.configDbName = dbName;
  }
  /**
   * Get the database name.
   *
   * Order: configured value > process.env.DBLINT_DATABASE_NAME > ''
   *
   * @returns Database name or empty string.
   */
  get dbName(): string {
    return this.configDbName || process.env.DBLINT_DATABASE_NAME || '';
  }

  /**
   * Set the database user.
   *
   * @param dbUser Username for DB connection. If undefined, getter uses env or empty string.
   */
  set dbUser(dbUser: string | undefined) {
    this.configDbUser = dbUser;
  }
  /**
   * Get the database user.
   *
   * Order: configured value > process.env.DBLINT_DATABASE_USER > ''
   *
   * @returns Username for DB connection or empty string.
   */
  get dbUser(): string {
    return this.configDbUser || process.env.DBLINT_DATABASE_USER || '';
  }

  /**
   * Set the database password.
   *
   * @param dbPassword Password for DB connection. If undefined, getter uses env or empty string.
   */
  set dbPassword(dbPassword: string | undefined) {
    this.configDbPassword = dbPassword;
  }
  /**
   * Get the database password.
   *
   * Order: configured value > process.env.DBLINT_DATABASE_PASSWORD > ''
   *
   * @returns Password for DB connection or empty string.
   */
  get dbPassword(): string {
    return this.configDbPassword || process.env.DBLINT_DATABASE_PASSWORD || '';
  }

  /**
   * Set the database host.
   *
   * @param dbHost Hostname or IP. If undefined, getter uses env or 'localhost'.
   */
  set dbHost(dbHost: string | undefined) {
    this.configDbHost = dbHost;
  }
  /**
   * Get the database host.
   *
   * Order: configured value > process.env.DBLINT_DATABASE_HOST > 'localhost'
   *
   * @returns Hostname used to connect to the database.
   */
  get dbHost(): string {
    return this.configDbHost || process.env.DBLINT_DATABASE_HOST || 'localhost';
  }

  /**
   * Set the database port.
   *
   * @param dbPort TCP port number. If undefined, getter uses env or 5432.
   */
  set dbPort(dbPort: number | undefined) {
    this.configDbPort = dbPort;
  }
  /**
   * Get the database port.
   *
   * If a positive configured value exists, it is used; otherwise falls back to env or 5432.
   *
   * Env var: DBLINT_DATABASE_PORT
   *
   * @returns TCP port number.
   */
  get dbPort(): number {
    if (this.configDbPort && this.configDbPort > 0) {
      return this.configDbPort;
    }
    return parseInt(process.env.DBLINT_DATABASE_PORT || '5432');
  }

  /**
   * Set tables to ignore during linting.
   *
   * @param ignoreTables Array of table names to ignore. If undefined, getter uses env or defaults.
   */
  set ignoreTables(ignoreTables: string[] | undefined) {
    this.configIgnoreTables = ignoreTables;
  }
  /**
   * Get the list of tables to ignore during linting.
   *
   * Order: configured value > process.env.DBLINT_IGNORE_TABLES (JSON array) > default ["knex_migrations","knex_migrations_lock"].
   *
   * @returns Array of table names to ignore.
   */
  get ignoreTables(): string[] {
    if (this.configIgnoreTables) {
      return this.configIgnoreTables;
    }
    return JSON.parse(process.env.DBLINT_IGNORE_TABLES || '["knex_migrations","knex_migrations_lock"]');
  }

  /**
   * Set the default maximum length for all identifier kinds.
   *
   * @param defaultMaxLengthOfIdentifiers Positive integer. If undefined or invalid, getter uses env or 50.
   */
  set defaultMaxLengthOfIdentifiers(defaultMaxLengthOfIdentifiers: number | undefined) {
    this.configDefaultMaxLengthOfIdentifiers = defaultMaxLengthOfIdentifiers;
  }
  /**
   * Get the default maximum length for identifiers.
   *
   * If a positive configured value exists, it is used; otherwise falls back to env or 50.
   *
   * Env var: DBLINT_DEFAULT_MAXLENGTH_OF_IDENTIFIERS
   *
   * @returns Default maximum length (number).
   */
  get defaultMaxLengthOfIdentifiers(): number {
    if (this.configDefaultMaxLengthOfIdentifiers && this.configDefaultMaxLengthOfIdentifiers > 0) {
      return this.configDefaultMaxLengthOfIdentifiers;
    }
    return parseInt(process.env.DBLINT_DEFAULT_MAXLENGTH_OF_IDENTIFIERS || '50');
  }

  /**
   * Set per-identifier maximum lengths.
   *
   * @param maxLengthOfIdentifiers Object with optional overrides for table/column/constraint/index/foreignKey/view/trigger.
   */
  set maxLengthOfIdentifiers(maxLengthOfIdentifiers: MaxLengthOfIdentifiers | undefined) {
    this.configMaxLengthOfIdentifiers = maxLengthOfIdentifiers;
  }
  /**
   * Get per-identifier maximum lengths.
   *
   * Merges configured value or env JSON (DBLINT_MAXLENGTH_OF_IDENTIFIERS) with defaults from defaultMaxLengthOfIdentifiers.
   *
   * @returns Object containing max length for each identifier kind.
   */
  get maxLengthOfIdentifiers(): MaxLengthOfIdentifiers {
    if (this.configMaxLengthOfIdentifiers) {
      return this.configMaxLengthOfIdentifiers;
    }

    const custom = JSON.parse(process.env.DBLINT_MAXLENGTH_OF_IDENTIFIERS || '{}');
    const defaultMaxLength = this.defaultMaxLengthOfIdentifiers;
    return {
      table: custom.table ?? defaultMaxLength,
      column: custom.column ?? defaultMaxLength,
      constraint: custom.constraint ?? defaultMaxLength,
      index: custom.index ?? defaultMaxLength,
      foreignKey: custom.foreignKey ?? defaultMaxLength,
      view: custom.view ?? defaultMaxLength,
      trigger: custom.trigger ?? defaultMaxLength
    };
  }

  /**
   * Set the default case type for all identifiers.
   *
   * @param defaultCaseTypeOfIdentifiers Case style to apply when no specific override is defined.
   */
  set defaultCaseTypeOfIdentifiers(defaultCaseTypeOfIdentifiers: CaseType | undefined) {
    this.configDefaultCaseTypeOfIdentifiers = defaultCaseTypeOfIdentifiers;
  }
  /**
   * Get the default case type for identifiers.
   *
   * Order: configured value > process.env.DBLINT_DEFAULT_CASE_TYPE_OF_IDENTIFIERS > CaseType.SNAKE_CASE.
   *
   * @returns Default case type.
   */
  get defaultCaseTypeOfIdentifiers(): CaseType {
    if (this.configDefaultCaseTypeOfIdentifiers) {
      return this.configDefaultCaseTypeOfIdentifiers;
    }
    return (process.env.DBLINT_DEFAULT_CASE_TYPE_OF_IDENTIFIERS || CaseType.SNAKE_CASE) as CaseType;
  }

  /**
   * Set per-identifier case type preferences.
   *
   * @param caseTypeOfIdentifiers Object with optional overrides for table/column/constraint/index/foreignKey/view/trigger.
   */
  set caseTypeOfIdentifiers(caseTypeOfIdentifiers: CaseTypeOfIdentifiers | undefined) {
    this.configCaseTypeOfIdentifiers = caseTypeOfIdentifiers;
  }
  /**
   * Get per-identifier case type preferences.
   *
   * Merges configured value or env JSON (DBLINT_CASE_TYPE_OF_IDENTIFIERS) with defaults from defaultCaseTypeOfIdentifiers.
   *
   * @returns Object containing case type for each identifier kind.
   */
  get caseTypeOfIdentifiers(): CaseTypeOfIdentifiers {
    if (this.configCaseTypeOfIdentifiers) {
      return this.configCaseTypeOfIdentifiers;
    }
    const custom = JSON.parse(process.env.DBLINT_CASE_TYPE_OF_IDENTIFIERS || '{}');
    const defaultCaseType = this.defaultCaseTypeOfIdentifiers;
    return {
      table: custom.table ?? defaultCaseType,
      column: custom.column ?? defaultCaseType,
      constraint: custom.constraint ?? defaultCaseType,
      index: custom.index ?? defaultCaseType,
      foreignKey: custom.foreignKey ?? defaultCaseType,
      view: custom.view ?? defaultCaseType,
      trigger: custom.trigger ?? defaultCaseType
    };
  }

  /**
   * Set custom table name mappings.
   *
   * Example:
   * ```ts
   * { "actual_table_name": "preferred_name" }
   * ```
   *
   * @param customTableNames Map of actual_table_name to preferred_name.
   */
  set customTableNames(customTableNames: Record<string, string> | undefined) {
    this.configCustomTableNames = customTableNames;
  }
  /**
   * Get custom table name mappings.
   *
   * Order: configured value > process.env.DBLINT_CUSTOM_TABLE_NAMES (JSON object) > {}.
   *
   * @returns Map of actual_table_name -> preferred_name.
   */
  get customTableNames(): Record<string, string> {
    if (this.configCustomTableNames) {
      return this.configCustomTableNames;
    }
    return JSON.parse(process.env.DBLINT_CUSTOM_TABLE_NAMES || '{}');
  }

  /**
   * Set custom view name mappings.
   *
   * Example:
   * ```ts
   * { "actual_view_name": "preferred_name" }
   * ```
   *
   * @param customViewNames Map of actual_view_name -> preferred_name.
   */
  set customViewNames(customViewNames: Record<string, string> | undefined) {
    this.configCustomViewNames = customViewNames;
  }
  /**
   * Get custom view name mappings.
   *
   * Order: configured value > process.env.DBLINT_CUSTOM_VIEW_NAMES (JSON object) > {}.
   *
   * @returns Map of actual_view_name -> preferred_name.
   */
  get customViewNames(): Record<string, string> {
    if (this.configCustomViewNames) {
      return this.configCustomViewNames;
    }
    return JSON.parse(process.env.DBLINT_CUSTOM_VIEW_NAMES || '{}');
  }

  /**
   * Set custom column name mappings.
   *
   * Example:
   * ```ts
   * { "table_name": { "actual_column_name": "preferred_name" } }
   * ```
   *
   * @param customColumnNames Map of table_name -> (actual_column_name -> preferred_name).
   */
  set customColumnNames(customColumnNames: Record<string, Record<string, string>> | undefined) {
    this.configCustomColumnNames = customColumnNames;
  }
  /**
   * Get custom column name mappings.
   *
   * Order: configured value > process.env.DBLINT_CUSTOM_COLUMN_NAMES (nested JSON object) > {}.
   *
   * @returns Map of table_name -> (actual_column_name -> preferred_name).
   */
  get customColumnNames(): Record<string, Record<string, string>> {
    if (this.configCustomColumnNames) {
      return this.configCustomColumnNames;
    }
    return JSON.parse(process.env.DBLINT_CUSTOM_COLUMN_NAMES || '{}');
  }

  /**
   * Set custom constraint name mappings.
   *
   * Example:
   * ```ts
   * { "table_name": { "actual_constraint_name": "preferred_name" } }
   * ```
   *
   * @param customConstraintNames Map of table_name -> (actual_constraint_name -> preferred_name).
   */
  set customConstraintNames(
    customConstraintNames: Record<string, Record<string, string>> | undefined
  ) {
    this.configCustomConstraintNames = customConstraintNames;
  }
  /**
   * Get custom constraint name mappings.
   *
   * Order: configured value > process.env.DBLINT_CUSTOM_CONSTRAINT_NAMES (nested JSON object) > {}.
   *
   * @returns Map of table_name -> (actual_constraint_name -> preferred_name).
   */
  get customConstraintNames(): Record<string, Record<string, string>> {
    if (this.configCustomConstraintNames) {
      return this.configCustomConstraintNames;
    }
    return JSON.parse(process.env.DBLINT_CUSTOM_CONSTRAINT_NAMES || '{}');
  }

  /**
   * Set custom index name mappings.
   *
   * Example:
   * ```ts
   * { "table_name": { "actual_index_name": "preferred_name" } }
   * ```
   *
   * @param customIndexNames Map of table_name -> (actual_index_name -> preferred_name).
   */
  set customIndexNames(customIndexNames: Record<string, Record<string, string>> | undefined) {
    this.configCustomIndexNames = customIndexNames;
  }
  /**
   * Get custom index name mappings.
   *
   * Order: configured value > process.env.DBLINT_CUSTOM_INDEX_NAMES (nested JSON object) > {}.
   *
   * @returns Map of table_name -> (actual_index_name -> preferred_name).
   */
  get customIndexNames(): Record<string, Record<string, string>> {
    if (this.configCustomIndexNames) {
      return this.configCustomIndexNames;
    }
    return JSON.parse(process.env.DBLINT_CUSTOM_INDEX_NAMES || '{}');
  }

  /**
   * Set custom trigger name mappings.
   *
   * Example:
   * ```ts
   * { "table_name": { "actual_trigger_name": "preferred_name" } }
   * ```
   *
   * @param customTriggerNames Map of table_name -> (actual_trigger_name -> preferred_name).
   */
  set customTriggerNames(customTriggerNames: Record<string, Record<string, string>> | undefined) {
    this.configCustomTriggerNames = customTriggerNames;
  }
  /**
   * Get custom trigger name mappings.
   *
   * Order: configured value > process.env.DBLINT_CUSTOM_TRIGGER_NAMES (nested JSON object) > {}.
   *
   * @returns Map of table_name -> (actual_trigger_name -> preferred_name).
   */
  get customTriggerNames(): Record<string, Record<string, string>> {
    if (this.configCustomTriggerNames) {
      return this.configCustomTriggerNames;
    }
    return JSON.parse(process.env.DBLINT_CUSTOM_TRIGGER_NAMES || '{}');
  }

  /**
   * Set custom foreign key name mappings.
   *
   * Example:
   * ```ts
   * { "table_name": { "actual_fk_name": "preferred_name" } }
   * ```
   *
   * @param customForeignKeyNames Map of table_name -> (actual_fk_name -> preferred_name).
   */
  set customForeignKeyNames(
    customForeignKeyNames: Record<string, Record<string, string>> | undefined
  ) {
    this.configCustomForeignKeyNames = customForeignKeyNames;
  }
  /**
   * Get custom foreign key name mappings.
   *
   * Order: configured value > process.env.DBLINT_CUSTOM_FOREIGN_KEY_NAMES (nested JSON object) > {}.
   *
   * @returns Map of table_name -> (actual_fk_name -> preferred_name).
   */
  get customForeignKeyNames(): Record<string, Record<string, string>> {
    if (this.configCustomForeignKeyNames) {
      return this.configCustomForeignKeyNames;
    }
    return JSON.parse(process.env.DBLINT_CUSTOM_FOREIGN_KEY_NAMES || '{}');
  }

  /**
   * Set rules to ignore specific validation errors.
   *
   * Example:
   * ```ts
   * { "<current_table_or_view_name>": { "<type>,<entity>,<identifier>": "<ignore_reason>" } }
   * ```
   *
   * @param ignoreValidationErrors Map of entity_type (e.g., table/column) -> (entity_name -> error_code_to_ignore).
   */
  set ignoreValidationErrors(
    ignoreValidationErrors: Record<string, Record<string, string>> | undefined
  ) {
    this.configIgnoreValidationErrors = ignoreValidationErrors;
  }
  /**
   * Get rules to ignore specific validation errors.
   *
   * Order: configured value > process.env.DBLINT_IGNORE_VALIDATION_ERRORS (nested JSON object) > {}.
   *
   * @returns Map of entity_type -> (entity_name -> error_code_to_ignore).
   */
  get ignoreValidationErrors(): Record<string, Record<string, string>> {
    if (this.configIgnoreValidationErrors) {
      return this.configIgnoreValidationErrors;
    }
    return JSON.parse(process.env.DBLINT_IGNORE_VALIDATION_ERRORS || '{}');
  }
}

export default new Configs();
