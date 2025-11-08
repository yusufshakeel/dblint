import { DatabaseType } from '../types/database';
import { CaseTypeOfIdentifiers, MaxLengthOfIdentifiers } from '../types/lint';
import { CaseType } from '../types/case-type';

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

  set dbType(dbType: DatabaseType | undefined) {
    this.configDbType = dbType;
  }
  get dbType(): DatabaseType {
    return (
        this.configDbType ||
        process.env.DBLINT_DATABASE_TYPE ||
        DatabaseType.postgres
    ) as DatabaseType;
  }

  set dbName(dbName: string | undefined) {
    this.configDbName = dbName;
  }
  get dbName(): string {
    return this.configDbName || process.env.DBLINT_DATABASE_NAME || '';
  }

  set dbUser(dbUser: string | undefined) {
    this.configDbUser = dbUser;
  }
  get dbUser(): string {
    return this.configDbUser || process.env.DBLINT_DATABASE_USER || '';
  }

  set dbPassword(dbPassword: string | undefined) {
    this.configDbPassword = dbPassword;
  }
  get dbPassword(): string {
    return this.configDbPassword || process.env.DBLINT_DATABASE_PASSWORD || '';
  }

  set dbHost(dbHost: string | undefined) {
    this.configDbHost = dbHost;
  }
  get dbHost(): string {
    return this.configDbHost || process.env.DBLINT_DATABASE_HOST || 'localhost';
  }

  set dbPort(dbPort: number | undefined) {
    this.configDbPort = dbPort;
  }
  get dbPort(): number {
    if (this.configDbPort && this.configDbPort > 0) {
      return this.configDbPort;
    }
    return parseInt(process.env.DBLINT_DATABASE_PORT || '5432');
  }

  set ignoreTables(ignoreTables: string[] | undefined) {
    this.configIgnoreTables = ignoreTables;
  }
  get ignoreTables(): string[] {
    if (this.configIgnoreTables) {
      return this.configIgnoreTables;
    }
    return JSON.parse(process.env.DBLINT_IGNORE_TABLES || '["knex_migrations","knex_migrations_lock"]');
  }

  set defaultMaxLengthOfIdentifiers(defaultMaxLengthOfIdentifiers: number | undefined) {
    this.configDefaultMaxLengthOfIdentifiers = defaultMaxLengthOfIdentifiers;
  }
  get defaultMaxLengthOfIdentifiers(): number {
    if (this.configDefaultMaxLengthOfIdentifiers && this.configDefaultMaxLengthOfIdentifiers > 0) {
      return this.configDefaultMaxLengthOfIdentifiers;
    }
    return parseInt(process.env.DBLINT_DEFAULT_MAXLENGTH_OF_IDENTIFIERS || '50');
  }

  set maxLengthOfIdentifiers(maxLengthOfIdentifiers: MaxLengthOfIdentifiers | undefined) {
    this.configMaxLengthOfIdentifiers = maxLengthOfIdentifiers;
  }
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

  set defaultCaseTypeOfIdentifiers(defaultCaseTypeOfIdentifiers: CaseType | undefined) {
    this.configDefaultCaseTypeOfIdentifiers = defaultCaseTypeOfIdentifiers;
  }
  get defaultCaseTypeOfIdentifiers(): CaseType {
    if (this.configDefaultCaseTypeOfIdentifiers) {
      return this.configDefaultCaseTypeOfIdentifiers;
    }
    return (process.env.DBLINT_DEFAULT_CASE_TYPE_OF_IDENTIFIERS || CaseType.SNAKE_CASE) as CaseType;
  }

  set caseTypeOfIdentifiers(caseTypeOfIdentifiers: CaseTypeOfIdentifiers | undefined) {
    this.configCaseTypeOfIdentifiers = caseTypeOfIdentifiers;
  }
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

  set customTableNames(customTableNames: Record<string, string> | undefined) {
    this.configCustomTableNames = customTableNames;
  }
  get customTableNames(): Record<string, string> {
    if (this.configCustomTableNames) {
      return this.configCustomTableNames;
    }
    return JSON.parse(process.env.DBLINT_CUSTOM_TABLE_NAMES || '{}');
  }

  set customViewNames(customViewNames: Record<string, string> | undefined) {
    this.configCustomViewNames = customViewNames;
  }
  get customViewNames(): Record<string, string> {
    if (this.configCustomViewNames) {
      return this.configCustomViewNames;
    }
    return JSON.parse(process.env.DBLINT_CUSTOM_VIEW_NAMES || '{}');
  }

  set customColumnNames(customColumnNames: Record<string, Record<string, string>> | undefined) {
    this.configCustomColumnNames = customColumnNames;
  }
  get customColumnNames(): Record<string, Record<string, string>> {
    if (this.configCustomColumnNames) {
      return this.configCustomColumnNames;
    }
    return JSON.parse(process.env.DBLINT_CUSTOM_COLUMN_NAMES || '{}');
  }

  set customConstraintNames(
    customConstraintNames: Record<string, Record<string, string>> | undefined
  ) {
    this.configCustomConstraintNames = customConstraintNames;
  }
  get customConstraintNames(): Record<string, Record<string, string>> {
    if (this.configCustomConstraintNames) {
      return this.configCustomConstraintNames;
    }
    return JSON.parse(process.env.DBLINT_CUSTOM_CONSTRAINT_NAMES || '{}');
  }

  set customIndexNames(customIndexNames: Record<string, Record<string, string>> | undefined) {
    this.configCustomIndexNames = customIndexNames;
  }
  get customIndexNames(): Record<string, Record<string, string>> {
    if (this.configCustomIndexNames) {
      return this.configCustomIndexNames;
    }
    return JSON.parse(process.env.DBLINT_CUSTOM_INDEX_NAMES || '{}');
  }

  set customTriggerNames(customTriggerNames: Record<string, Record<string, string>> | undefined) {
    this.configCustomTriggerNames = customTriggerNames;
  }
  get customTriggerNames(): Record<string, Record<string, string>> {
    if (this.configCustomTriggerNames) {
      return this.configCustomTriggerNames;
    }
    return JSON.parse(process.env.DBLINT_CUSTOM_TRIGGER_NAMES || '{}');
  }

  set customForeignKeyNames(
    customForeignKeyNames: Record<string, Record<string, string>> | undefined
  ) {
    this.configCustomForeignKeyNames = customForeignKeyNames;
  }
  get customForeignKeyNames(): Record<string, Record<string, string>> {
    if (this.configCustomForeignKeyNames) {
      return this.configCustomForeignKeyNames;
    }
    return JSON.parse(process.env.DBLINT_CUSTOM_FOREIGN_KEY_NAMES || '{}');
  }

  set ignoreValidationErrors(
    ignoreValidationErrors: Record<string, Record<string, string>> | undefined
  ) {
    this.configIgnoreValidationErrors = ignoreValidationErrors;
  }
  get ignoreValidationErrors(): Record<string, Record<string, string>> {
    if (this.configIgnoreValidationErrors) {
      return this.configIgnoreValidationErrors;
    }
    return JSON.parse(process.env.DBLINT_IGNORE_VALIDATION_ERRORS || '{}');
  }
}

export default new Configs();
