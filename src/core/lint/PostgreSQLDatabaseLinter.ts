import {
  Lint,
  LintColumn, LintConstraint,
  LintForeignKey, LintIndex,
  LintTable, LintTrigger,
  LintView
} from '../../types/lint';
import {
  Column,
  Constraint,
  ForeignKey,
  Index,
  Table,
  Trigger,
  View
} from '../../types/database';
import PostgreSQLDatabaseSuggester from './suggesters/PostgreSQLDatabaseSuggester';
import PostgreSQLDatabaseValidator from './validators/PostgreSQLDatabaseValidator';
import { getSchema } from '../database/schema/schema';
import { Linter } from './Linter';

/**
 * Represents a mapping of table columns where each key corresponds to the original column name
 * and the value represents the new table name and whether it is a custom identifier.
 *
 * Keys:
 * - The key is a string representing the original name of the table.
 *
 * Values:
 * - An object with the following properties:
 *   - `newName`: A string that specifies the new name of the table.
 *   - `isCustomIdentifier`: A boolean indicating whether the new table name is a custom identifier.
 */
type TableMapType = Record<string, { newName: string, isCustomIdentifier: boolean }>;

/**
 * Represents a structured map configuration used to manage column transformations.
 *
 * The `ColumnMapType` is a nested structure where:
 * - The first level keys are strings that typically represent tables.
 * - The second level keys represent specific columns within those tables.
 * - The values on the deepest level are objects containing properties for how
 *   each column should be transformed or processed.
 *
 * Structure:
 * - First level keys: A string identifying the old table name.
 * - Second level keys: A string identifying the old column name.
 * - Values: An object containing metadata for the column transformation:
 *   - `newName`: A string specifying the new name for the column.
 *   - `isCustomIdentifier`: A boolean indicating if the new column name is a custom identifier.
 */
type ColumnMapType =
    Record<string, Record<string, { newName: string, isCustomIdentifier: boolean }>>;

class PostgreSQLDatabaseLinter implements Linter {
  private oldToNewTableNameMap: TableMapType = {};
  private oldToNewColumnNameMap: ColumnMapType = {};

  async lint(): Promise<Lint> {
    const schema = await getSchema();

    schema.tables.forEach((table: Table) => {
      const newTableNameResult = PostgreSQLDatabaseSuggester.suggestTableName(table.name);
      this.oldToNewTableNameMap[table.name] = {
        newName: newTableNameResult.newName,
        isCustomIdentifier: newTableNameResult.isCustomIdentifier
      };

      table.columns.forEach((column: Column) => {
        const newColumnNameResult = PostgreSQLDatabaseSuggester.suggestColumnName(
          table.name, column.name
        );
        this.oldToNewColumnNameMap[table.name] = {
          ...this.oldToNewColumnNameMap[table.name],
          [column.name]: {
            newName: newColumnNameResult.newName,
            isCustomIdentifier: newColumnNameResult.isCustomIdentifier
          }
        };
      });
    });

    const lintedTables = schema.tables.map((table: Table): LintTable => {
      const newTableNameResult = this.oldToNewTableNameMap[table.name];
      const validations = PostgreSQLDatabaseValidator.validateTableName(
        table.name, newTableNameResult.newName
      );

      const lintedColumns = table.columns.map((column: Column): LintColumn => {
        const newColumnNameResult = this.oldToNewColumnNameMap[table.name][column.name];
        const columnValidations = PostgreSQLDatabaseValidator.validateColumnName(
          column.name, newColumnNameResult.newName
        );

        validations.push(...columnValidations);

        return {
          suggestion: {
            newName: newColumnNameResult.newName,
            isCustomIdentifier: newColumnNameResult.isCustomIdentifier,
            isChangeNeeded: column.name !== newColumnNameResult.newName
          },
          ...column
        };
      });

      const lintedConstraints = table.constraints.map((constraint: Constraint): LintConstraint => {
        const newColumnNames = constraint.columns.map(
          columnName => this.oldToNewColumnNameMap[table.name][columnName].newName
        );
        const newConstraintNameResult = PostgreSQLDatabaseSuggester.suggestConstraintName(
          table.name,
          newTableNameResult.newName,
          constraint.name,
          newColumnNames,
          constraint.type
        );

        const constraintValidation = PostgreSQLDatabaseValidator.validateConstraintName(
          constraint.name, newConstraintNameResult.newName
        );

        validations.push(...constraintValidation);

        return {
          suggestion: {
            newName: newConstraintNameResult.newName,
            isCustomIdentifier: newConstraintNameResult.isCustomIdentifier,
            isChangeNeeded: constraint.name !== newConstraintNameResult.newName
          },
          ...constraint
        };
      });

      const lintIndexes = table.indexes.map((index: Index): LintIndex => {
        const newColumnNames = index.columns.map(
          columnName => this.oldToNewColumnNameMap[table.name][columnName].newName
        );
        const newIndexNameResult = PostgreSQLDatabaseSuggester.suggestIndexName(
          table.name,
          newTableNameResult.newName,
          index.name,
          newColumnNames,
          index.type
        );

        const indexValidation = PostgreSQLDatabaseValidator.validateIndexName(
          index.name, newIndexNameResult.newName
        );

        validations.push(...indexValidation);

        return {
          suggestion: {
            newName: newIndexNameResult.newName,
            isCustomIdentifier: newIndexNameResult.isCustomIdentifier,
            isChangeNeeded: index.name !== newIndexNameResult.newName
          },
          ...index
        };
      });

      const lintTriggers = table.triggers.map((trigger: Trigger): LintTrigger => {
        const newColumnNames = trigger.columns.map(
          columnName => this.oldToNewColumnNameMap[table.name][columnName].newName
        );
        const newTriggerNameResult = PostgreSQLDatabaseSuggester.suggestTriggerName(
          table.name,
          newTableNameResult.newName,
          trigger.name,
          newColumnNames,
          trigger.timing,
          trigger.events
        );

        const triggerValidations = PostgreSQLDatabaseValidator.validateTriggerName(
          trigger.name, newTriggerNameResult.newName
        );

        validations.push(...triggerValidations);

        return {
          suggestion: {
            newName: newTriggerNameResult.newName,
            isCustomIdentifier: newTriggerNameResult.isCustomIdentifier,
            isChangeNeeded: trigger.name !== newTriggerNameResult.newName
          },
          ...trigger
        };
      });

      const lintForeignKeys = table.foreignKeys.map((foreignKey: ForeignKey): LintForeignKey => {
        const newColumnNames = foreignKey.columns.map(
          columnName => this.oldToNewColumnNameMap[table.name][columnName].newName
        );
        const referenceTableNewColumNames = foreignKey.referencedColumns.map(
          columnName => this.oldToNewColumnNameMap[foreignKey.referencedTable][columnName].newName
        );
        const referenceTableNewName = this.oldToNewTableNameMap[foreignKey.referencedTable].newName;
        const newForeignKeyNameResult = PostgreSQLDatabaseSuggester.suggestForeignKeyName(
          table.name,
          newTableNameResult.newName,
          foreignKey.name,
          newColumnNames,
          referenceTableNewName,
          referenceTableNewColumNames
        );

        const foreignKeyValidations = PostgreSQLDatabaseValidator.validateForeignKeyName(
          foreignKey.name, newForeignKeyNameResult.newName
        );

        validations.push(...foreignKeyValidations);

        return {
          suggestion: {
            newName: newForeignKeyNameResult.newName,
            isCustomIdentifier: newForeignKeyNameResult.isCustomIdentifier,
            isChangeNeeded: foreignKey.name !== newForeignKeyNameResult.newName
          },
          ...foreignKey
        };
      });

      return {
        suggestion: {
          newName: newTableNameResult.newName,
          isCustomIdentifier: newTableNameResult.isCustomIdentifier,
          isChangeNeeded: table.name !== newTableNameResult.newName
        },
        name: table.name,
        columns: lintedColumns,
        constraints: lintedConstraints,
        foreignKeys: lintForeignKeys,
        indexes: lintIndexes,
        triggers: lintTriggers,
        validations
      };
    });

    const lintedViews = schema.views.map((view: View): LintView => {
      const { name, tableNames } = view;
      const newTableNames = tableNames.map(
        tableName => this.oldToNewTableNameMap[tableName].newName
      );
      const { newName, isCustomIdentifier } =
            PostgreSQLDatabaseSuggester.suggestViewName(name, newTableNames);
      const validations = PostgreSQLDatabaseValidator.validateViewName(name, newName);
      return {
        suggestion: {
          newName,
          isCustomIdentifier,
          isChangeNeeded: name !== newName
        },
        ...view,
        validations
      };
    });

    return {
      tables: lintedTables,
      views: lintedViews
    };
  }
}

export default PostgreSQLDatabaseLinter;
