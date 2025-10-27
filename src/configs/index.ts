import { DatabaseType } from '../types/database';
import { CaseTypeOfIdentifiers, MaxLengthOfIdentifiers } from '../types/lint';
import { CaseType } from '../types/case-type';

class Configs {
  get dbType(): DatabaseType {
    return process.env.DBLINT_DATABASE_TYPE as DatabaseType;
  }

  get dbName(): string {
    return process.env.DBLINT_DATABASE_NAME || '';
  }

  get dbUser(): string {
    return process.env.DBLINT_DATABASE_USER || '';
  }

  get dbPassword(): string {
    return process.env.DBLINT_DATABASE_PASSWORD || '';
  }

  get dbHost(): string {
    return process.env.DBLINT_DATABASE_HOST || 'localhost';
  }

  get dbPort(): number {
    return parseInt(process.env.DBLINT_DATABASE_PORT || '5432');
  }

  get ignoreTables(): string[] {
    return JSON.parse(process.env.DBLINT_IGNORE_TABLES || '[]');
  }

  get maxLengthOfIdentifiers(): MaxLengthOfIdentifiers {
    const custom = JSON.parse(process.env.DBLINT_MAXLENGTH_OF_IDENTIFIERS || '{}');
    const defaultMaxLength = parseInt(process.env.DBLINT_DEFAULT_MAXLENGTH_OF_IDENTIFIERS || '50');
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

  get caseTypeOfIdentifiers(): CaseTypeOfIdentifiers {
    const custom = JSON.parse(process.env.DBLINT_CASE_TYPE_OF_IDENTIFIERS || '{}');
    const defaultCaseType =
        process.env.DBLINT_DEFAULT_CASE_TYPE_OF_IDENTIFIERS || CaseType.SNAKE_CASE;
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

  get customTableNames(): Record<string, string> {
    return JSON.parse(process.env.DBLINT_CUSTOM_TABLE_NAMES || '{}');
  }

  get customViewNames(): Record<string, string> {
    return JSON.parse(process.env.DBLINT_CUSTOM_VIEW_NAMES || '{}');
  }

  get customColumnNames(): Record<string, Record<string, string>> {
    return JSON.parse(process.env.DBLINT_CUSTOM_COLUMN_NAMES || '{}');
  }

  get customConstraintNames(): Record<string, Record<string, string>> {
    return JSON.parse(process.env.DBLINT_CUSTOM_CONSTRAINT_NAMES || '{}');
  }

  get customIndexNames(): Record<string, Record<string, string>> {
    return JSON.parse(process.env.DBLINT_CUSTOM_INDEX_NAMES || '{}');
  }

  get customTriggerNames(): Record<string, Record<string, string>> {
    return JSON.parse(process.env.DBLINT_CUSTOM_TRIGGER_NAMES || '{}');
  }

  get customForeignKeyNames(): Record<string, Record<string, string>> {
    return JSON.parse(process.env.DBLINT_CUSTOM_FOREIGN_KEY_NAMES || '{}');
  }
}

export default new Configs();
