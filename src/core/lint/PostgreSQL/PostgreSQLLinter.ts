import {
  Lint,
  LintColumn,
  LintConstraint,
  LintForeignKey,
  LintIndex,
  LintTable,
  LintTrigger,
  LintView,
  OldToNewColumnNameMapType,
  OldToNewTableNameMapType,
  Validation,
  ValidationEntity
} from '../../../types/lint';
import { Column, Constraint, ForeignKey, Index, Schema, Table, Trigger, View } from '../../../types/database';
import PostgreSQLLintSuggester from './PostgreSQLLintSuggester';
import PostgreSQLLintValidator from './PostgreSQLLintValidator';
import { getSchema } from '../../database/schema/schema';
import { Linter } from '../Linter';
import { getStats, getTotalStats } from './PostgreSQLLintStats';

export const getLintedColumns = (
  table: Table,
  oldToNewColumnNameMap: OldToNewColumnNameMapType
): { lintedColumns: LintColumn[], validations: Validation[] } => {
  const validations: Validation[] = [];

  const lintedColumns = table.columns.map((column: Column): LintColumn => {
    const newColumnNameResult = oldToNewColumnNameMap[table.name][column.name];

    const columnValidations = PostgreSQLLintValidator.enrichValidationErrorsWithIgnoreReasons(
      table.name,
      PostgreSQLLintValidator.validateColumnName(
        column.name, newColumnNameResult.newName
      )
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

  return { lintedColumns, validations };
};

export const getLintedConstraints = (
  table: Table,
  newTableName: string,
  oldToNewColumnNameMap: OldToNewColumnNameMapType
): { lintedConstraints: LintConstraint[], validations: Validation[] } => {
  const validations: Validation[] = [];

  const lintedConstraints = table.constraints.map((constraint: Constraint): LintConstraint => {
    const newColumnNames = constraint.columns.map(
      columnName => oldToNewColumnNameMap[table.name][columnName].newName
    );
    const newConstraintNameResult = PostgreSQLLintSuggester.suggestConstraintName(
      table.name,
      newTableName,
      constraint.name,
      newColumnNames,
      constraint.type
    );

    const constraintValidation = PostgreSQLLintValidator.enrichValidationErrorsWithIgnoreReasons(
      table.name,
      PostgreSQLLintValidator.validateConstraintName(
        constraint.name, newConstraintNameResult.newName
      )
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

  return { lintedConstraints, validations };
};

export const getLintedIndexes = (
  table: Table,
  newTableName: string,
  oldToNewColumnNameMap: OldToNewColumnNameMapType
): { lintedIndexes: LintIndex[], validations: Validation[] } => {
  const validations: Validation[] = [];

  const lintedIndexes = table.indexes.map((index: Index): LintIndex => {
    const newColumnNames = index.columns.map(
      columnName => oldToNewColumnNameMap[table.name][columnName].newName
    );
    const newIndexNameResult = PostgreSQLLintSuggester.suggestIndexName(
      table.name,
      newTableName,
      index.name,
      newColumnNames,
      index.type
    );

    const indexValidation = PostgreSQLLintValidator.enrichValidationErrorsWithIgnoreReasons(
      table.name,
      PostgreSQLLintValidator.validateIndexName(
        index.name, newIndexNameResult.newName
      )
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

  return { lintedIndexes, validations };
};

export const getLintedTriggers = (
  table: Table,
  newTableName: string,
  oldToNewColumnNameMap: OldToNewColumnNameMapType
): { lintedTriggers: LintTrigger[], validations: Validation[] } => {
  const validations: Validation[] = [];

  const lintedTriggers = table.triggers.map((trigger: Trigger): LintTrigger => {
    const newColumnNames = trigger.columns.map(
      columnName => oldToNewColumnNameMap[table.name][columnName].newName
    );
    const newTriggerNameResult = PostgreSQLLintSuggester.suggestTriggerName(
      table.name,
      newTableName,
      trigger.name,
      newColumnNames,
      trigger.timing,
      trigger.events
    );

    const triggerValidations = PostgreSQLLintValidator.enrichValidationErrorsWithIgnoreReasons(
      table.name,
      PostgreSQLLintValidator.validateTriggerName(
        trigger.name, newTriggerNameResult.newName
      )
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

  if (table.triggers.length) {
    validations.push(
      ...PostgreSQLLintValidator.validationInfo(
        ValidationEntity.TABLE,
        table.name,
        'Table has trigger(s). Do re-check the trigger(s) if you have changed the table and/or column(s).'
      )
    );
  }

  return { lintedTriggers, validations };
};

export const getLintedForeignKeys = (
  table: Table,
  newTableName: string,
  oldToNewTableNameMap: OldToNewTableNameMapType,
  oldToNewColumnNameMap: OldToNewColumnNameMapType
): { lintedForeignKeys: LintForeignKey[], validations: Validation[] } => {
  const validations: Validation[] = [];

  const lintedForeignKeys = table.foreignKeys.map((foreignKey: ForeignKey): LintForeignKey => {
    const newColumnNames = foreignKey.columns.map(
      columnName => oldToNewColumnNameMap[table.name][columnName].newName
    );
    const referenceTableNewColumNames = foreignKey.referencedColumns.map(
      columnName => oldToNewColumnNameMap[foreignKey.referencedTable][columnName].newName
    );
    const referenceTableNewName = oldToNewTableNameMap[foreignKey.referencedTable].newName;
    const newForeignKeyNameResult = PostgreSQLLintSuggester.suggestForeignKeyName(
      table.name,
      newTableName,
      foreignKey.name,
      newColumnNames,
      referenceTableNewName,
      referenceTableNewColumNames
    );

    const foreignKeyValidations = PostgreSQLLintValidator.enrichValidationErrorsWithIgnoreReasons(
      table.name,
      PostgreSQLLintValidator.validateForeignKeyName(
        foreignKey.name, newForeignKeyNameResult.newName
      )
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

  return { lintedForeignKeys, validations };
};

export const getLintedViews = (
  schema: Schema,
  oldToNewTableNameMap: OldToNewTableNameMapType
): LintView[] => {
  return schema.views.map((view: View): LintView => {
    const { name, tableNames } = view;
    const newTableNames = tableNames.map(
      tableName => oldToNewTableNameMap[tableName].newName
    );

    const { newName, isCustomIdentifier } = PostgreSQLLintSuggester.suggestViewName(
      name, newTableNames
    );
    const validations = PostgreSQLLintValidator.enrichValidationErrorsWithIgnoreReasons(
      view.name,
      PostgreSQLLintValidator.validateViewName(name, newName)
    );

    return {
      suggestion: {
        newName,
        isCustomIdentifier,
        isChangeNeeded: name !== newName
      },
      ...view,
      validations,
      stats: getStats(validations)
    };
  });
};

class PostgreSQLLinter implements Linter {
  async lint(): Promise<Lint> {
    const schema = await getSchema();

    const oldToNewTableNameMap: OldToNewTableNameMapType = {};
    const oldToNewColumnNameMap: OldToNewColumnNameMapType = {};

    schema.tables.forEach((table: Table) => {
      const newTableNameResult = PostgreSQLLintSuggester.suggestTableName(table.name);
      oldToNewTableNameMap[table.name] = {
        newName: newTableNameResult.newName,
        isCustomIdentifier: newTableNameResult.isCustomIdentifier
      };

      table.columns.forEach((column: Column) => {
        const newColumnNameResult = PostgreSQLLintSuggester.suggestColumnName(
          table.name, column.name
        );
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
      const validations = PostgreSQLLintValidator.validateTableName(
        table.name, newTableNameResult.newName
      );

      const { lintedColumns, validations: columnValidations } = getLintedColumns(
        table,
        oldToNewColumnNameMap
      );
      validations.push(...columnValidations);

      const { lintedConstraints, validations: constraintValidations } = getLintedConstraints(
        table,
        newTableNameResult.newName,
        oldToNewColumnNameMap
      );
      validations.push(...constraintValidations);

      const { lintedIndexes, validations: indexValidations } = getLintedIndexes(
        table,
        newTableNameResult.newName,
        oldToNewColumnNameMap
      );
      validations.push(...indexValidations);

      const { lintedTriggers, validations: viewValidations } = getLintedTriggers(
        table,
        newTableNameResult.newName,
        oldToNewColumnNameMap
      );
      validations.push(...viewValidations);

      const { lintedForeignKeys, validations: foreignKeyValidations } = getLintedForeignKeys(
        table,
        newTableNameResult.newName,
        oldToNewTableNameMap,
        oldToNewColumnNameMap
      );
      validations.push(...foreignKeyValidations);

      return {
        suggestion: {
          newName: newTableNameResult.newName,
          isCustomIdentifier: newTableNameResult.isCustomIdentifier,
          isChangeNeeded: table.name !== newTableNameResult.newName
        },
        name: table.name,
        columns: lintedColumns,
        constraints: lintedConstraints,
        foreignKeys: lintedForeignKeys,
        indexes: lintedIndexes,
        triggers: lintedTriggers,
        validations,
        stats: getStats(validations)
      };
    });

    const lintedViews = getLintedViews(schema, oldToNewTableNameMap);

    return {
      tables: lintedTables,
      views: lintedViews,
      stats: getTotalStats([
        ...lintedTables.map(table => table.stats),
        ...lintedViews.map(view => view.stats)
      ])
    };
  }
}

export default PostgreSQLLinter;
