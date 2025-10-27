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
import PostgreSQLSuggester from './suggesters/PostgreSQLSuggester';
import PostgreSQLValidator from './validators/PostgreSQLValidator';
import { getSchema } from '../database/schema/schema';

class PostgreSQLDatabaseLinter {
  static async lint(): Promise<Lint> {
    const schema = await getSchema();

    const oldToNewTableNameMap: Record<
          string,
          { newName: string, isCustomIdentifier: boolean }
      > = {};
    const oldToNewColumnNameMap: Record<
          string,
          Record<string, { newName: string, isCustomIdentifier: boolean }>
      > = {};

    schema.tables.forEach((table: Table) => {
      const newTableNameResult = PostgreSQLSuggester.suggestTableName(table.name);
      oldToNewTableNameMap[table.name] = {
        newName: newTableNameResult.newName,
        isCustomIdentifier: newTableNameResult.isCustomIdentifier
      };

      table.columns.forEach((column: Column) => {
        const newColumnNameResult = PostgreSQLSuggester.suggestColumnName(table.name, column.name);
        oldToNewColumnNameMap[table.name] = {
          ...oldToNewColumnNameMap[table.name],
          [column.name]: {
            newName: newColumnNameResult.newName,
            isCustomIdentifier: newColumnNameResult.isCustomIdentifier
          }
        };
      });
    });

    const lintedTables = schema.tables.map((table: Table): LintTable => {
      const newTableNameResult = oldToNewTableNameMap[table.name];
      const validations = newTableNameResult.isCustomIdentifier
        ? []
        : PostgreSQLValidator.validateTableName(table.name, newTableNameResult.newName);

      const lintedColumns = table.columns.map((column: Column): LintColumn => {
        const newColumnNameResult = oldToNewColumnNameMap[table.name][column.name];
        const columnValidations = newColumnNameResult.isCustomIdentifier
          ? []
          : PostgreSQLValidator.validateColumnName(column.name, newColumnNameResult.newName);

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
          columnName => oldToNewColumnNameMap[table.name][columnName].newName
        );
        const newConstraintNameResult = PostgreSQLSuggester.suggestConstraintName(
          table.name,
          newTableNameResult.newName,
          constraint.name,
          newColumnNames,
          constraint.type
        );

        const constraintValidation = newConstraintNameResult.isCustomIdentifier
          ? []
          : PostgreSQLValidator.validateConstraintName(
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
          columnName => oldToNewColumnNameMap[table.name][columnName].newName
        );
        const newIndexNameResult = PostgreSQLSuggester.suggestIndexName(
          table.name,
          newTableNameResult.newName,
          index.name,
          newColumnNames,
          index.type
        );

        const indexValidation = newIndexNameResult.isCustomIdentifier
          ? []
          : PostgreSQLValidator.validateIndexName(index.name, newIndexNameResult.newName);

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
          columnName => oldToNewColumnNameMap[table.name][columnName].newName
        );
        const newTriggerNameResult = PostgreSQLSuggester.suggestTriggerName(
          table.name,
          newTableNameResult.newName,
          trigger.name,
          newColumnNames,
          trigger.timing,
          trigger.events
        );

        const triggerValidations = newTriggerNameResult.isCustomIdentifier
          ? []
          : PostgreSQLValidator.validateTriggerName(trigger.name, newTriggerNameResult.newName);

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
          columnName => oldToNewColumnNameMap[table.name][columnName].newName
        );
        const referenceTableNewColumNames = foreignKey.referencedColumns.map(
          columnName => oldToNewColumnNameMap[foreignKey.referencedTable][columnName].newName
        );
        const referenceTableNewName = oldToNewTableNameMap[foreignKey.referencedTable].newName;
        const newForeignKeyNameResult = PostgreSQLSuggester.suggestForeignKeyName(
          table.name,
          newTableNameResult.newName,
          foreignKey.name,
          newColumnNames,
          referenceTableNewName,
          referenceTableNewColumNames
        );

        const foreignKeyValidations = newForeignKeyNameResult.isCustomIdentifier
          ? []
          : PostgreSQLValidator.validateForeignKeyName(
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
        tableName => oldToNewTableNameMap[tableName].newName
      );
      const { newName, isCustomIdentifier } =
          PostgreSQLSuggester.suggestViewName(name, newTableNames);
      const validations = isCustomIdentifier
        ? []
        : PostgreSQLValidator.validateViewName(name, newName);
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
