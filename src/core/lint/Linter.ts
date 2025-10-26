import pluralize from 'pluralize';
import databaseConnectionFactory from '../database/connections/database-connection-factory';
import Configs from '../../configs';
import databaseSchemaFactory from '../database/schema/database-schema-factory';
import {
  Lint,
  LintColumn, LintConstraint,
  LintedSchema, LintForeignKey, LintIndex,
  LintTable, LintTrigger,
  LintView,
  Validation,
  ValidationEntity,
  ValidationType
} from '../../types/lint';
import {
  Column,
  Constraint,
  ConstraintType, ForeignKey,
  Index,
  IndexType,
  Schema,
  Table,
  Trigger, TriggerEvent,
  TriggerTiming,
  View
} from '../../types/database';
import caseConverter from '../case-converter';
import { ConstraintPrefixType, IndexPrefixType, PREFIX } from '../../constants/prefix';

class Linter {
  static async lint(): Promise<Lint> {
    const dbConn = databaseConnectionFactory();
    const dbConnectionConfig = {
      dbHost: Configs.dbHost,
      dbName: Configs.dbName,
      dbUser: Configs.dbUser,
      dbPassword: Configs.dbPassword,
      dbPort: Configs.dbPort,
      dbType: Configs.dbType
    };

    const instance = await dbConn.getConnection(dbConnectionConfig);

    const dbSchema = databaseSchemaFactory(instance);
    const schema = await dbSchema.getSchema();

    await dbConn.closeConnection(instance);

    const lintedSchema = this.getLintedSchema(schema);

    return { schema, lintedSchema };
  }

  static getLintedSchema(schema: Schema): LintedSchema {
    const oldToNewTableNameMap: Record<
        string,
        { newName: string, isCustomIdentifier: boolean }
    > = {};
    const oldToNewColumnNameMap: Record<
        string,
        Record<string, { newName: string, isCustomIdentifier: boolean }>
    > = {};

    schema.tables.forEach((table: Table) => {
      const newTableNameResult = this.suggestTableName(table.name);
      oldToNewTableNameMap[table.name] = {
        newName: newTableNameResult.newName,
        isCustomIdentifier: newTableNameResult.isCustomIdentifier
      };

      table.columns.forEach((column: Column) => {
        const newColumnNameResult = this.suggestColumnName(table.name, column.name);
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
        : this.validateTableName(table.name, newTableNameResult.newName);

      const lintedColumns = table.columns.map((column: Column): LintColumn => {
        const newColumnNameResult = oldToNewColumnNameMap[table.name][column.name];
        const columnValidations = newColumnNameResult.isCustomIdentifier
          ? []
          : this.validateColumnName(column.name, newColumnNameResult.newName);

        validations.push(...columnValidations);

        return {
          suggestion: {
            name: column.name,
            newName: newColumnNameResult.newName,
            isCustomIdentifier: newColumnNameResult.isCustomIdentifier
          },
          column
        };
      });

      const lintedConstraints = table.constraints.map((constraint: Constraint): LintConstraint => {
        const newColumnNames = constraint.columns.map(
          columnName => oldToNewColumnNameMap[table.name][columnName].newName
        );
        const newConstraintNameResult = this.suggestConstraintName(
          table.name,
          newTableNameResult.newName,
          constraint.name,
          newColumnNames,
          constraint.type
        );

        const constraintValidation = newConstraintNameResult.isCustomIdentifier
          ? []
          : this.validateConstraintName(constraint.name, newConstraintNameResult.newName);

        validations.push(...constraintValidation);

        return {
          suggestion: {
            name: constraint.name,
            newName: newConstraintNameResult.newName,
            isCustomIdentifier: newConstraintNameResult.isCustomIdentifier
          },
          constraint
        };
      });

      const lintIndexes = table.indexes.map((index: Index): LintIndex => {
        const newColumnNames = index.columns.map(
          columnName => oldToNewColumnNameMap[table.name][columnName].newName
        );
        const newIndexNameResult = this.suggestIndexName(
          table.name,
          newTableNameResult.newName,
          index.name,
          newColumnNames,
          index.type
        );

        const indexValidation = newIndexNameResult.isCustomIdentifier
          ? []
          : this.validateIndexName(index.name, newIndexNameResult.newName);

        validations.push(...indexValidation);

        return {
          suggestion: {
            name: index.name,
            newName: newIndexNameResult.newName,
            isCustomIdentifier: newIndexNameResult.isCustomIdentifier
          },
          index
        };
      });

      const lintTriggers = table.triggers.map((trigger: Trigger): LintTrigger => {
        const newColumnNames = trigger.columns.map(
          columnName => oldToNewColumnNameMap[table.name][columnName].newName
        );
        const newTriggerNameResult = this.suggestTriggerName(
          table.name,
          newTableNameResult.newName,
          trigger.name,
          newColumnNames,
          trigger.timing,
          trigger.events
        );

        const triggerValidations = newTriggerNameResult.isCustomIdentifier
          ? []
          : this.validateTriggerName(trigger.name, newTriggerNameResult.newName);

        validations.push(...triggerValidations);

        return {
          suggestion: {
            name: trigger.name,
            newName: newTriggerNameResult.newName,
            isCustomIdentifier: newTriggerNameResult.isCustomIdentifier
          },
          trigger
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
        const newForeignKeyNameResult = this.suggestForeignKeyName(
          table.name,
          newTableNameResult.newName,
          foreignKey.name,
          newColumnNames,
          referenceTableNewName,
          referenceTableNewColumNames
        );

        const foreignKeyValidations = newForeignKeyNameResult.isCustomIdentifier
          ? []
          : this.validateForeignKeyName(foreignKey.name, newForeignKeyNameResult.newName);

        validations.push(...foreignKeyValidations);

        return {
          suggestion: {
            name: foreignKey.name,
            newName: newForeignKeyNameResult.newName,
            isCustomIdentifier: newForeignKeyNameResult.isCustomIdentifier
          },
          foreignKey
        };
      });

      return {
        suggestion: {
          name: table.name,
          newName: newTableNameResult.newName,
          isCustomIdentifier: newTableNameResult.isCustomIdentifier
        },
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
      const { newName, isCustomIdentifier } = this.suggestViewName(name, newTableNames);
      const validations = isCustomIdentifier ? [] : this.validateViewName(name, newName);
      return {
        suggestion: {
          name,
          newName,
          isCustomIdentifier
        },
        view,
        validations
      };
    });

    return {
      tables: lintedTables,
      views: lintedViews
    };
  }

  static suggestTableName(
    name: string
  ): { newName: string, isCustomIdentifier: boolean } {
    if (Configs.customTableNames[name]) {
      return { newName: Configs.customTableNames[name], isCustomIdentifier: true };
    }
    const result = caseConverter(pluralize.plural(name), Configs.caseTypeOfIdentifiers.table);
    return { newName: result.newIdentifier, isCustomIdentifier: false };
  }

  static validateTableName(name: string, newName: string) {
    const validations: Validation[] = [];
    if (name.length > Configs.maxLengthOfIdentifiers.table) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.TABLE,
        identifier: name,
        message: `Lengthy table name. Current: ${name.length} Allowed: ${Configs.maxLengthOfIdentifiers.table}.`
      });
    }
    if (newName.length > Configs.maxLengthOfIdentifiers.table) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.TABLE,
        identifier: newName,
        message: `New name of the table is lengthy. Current: ${newName.length} Allowed: ${Configs.maxLengthOfIdentifiers.table}.`
      });
    }
    if (name !== newName) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.TABLE,
        identifier: name,
        message: 'Change the table name.'
      });
    }
    return validations;
  }

  static suggestViewName(
    name: string,
    tableNames: string[]
  ): { newName: string, isCustomIdentifier: boolean } {
    if (Configs.customViewNames[name]) {
      return { newName: Configs.customViewNames[name], isCustomIdentifier: true };
    }
    const constructedName = [PREFIX.VIEW, ...tableNames].join('_');
    const result = caseConverter(constructedName, Configs.caseTypeOfIdentifiers.view);
    return { newName: result.newIdentifier, isCustomIdentifier: false };
  }

  static validateViewName(name: string, newName: string) {
    const validations: Validation[] = [];
    if (name.length > Configs.maxLengthOfIdentifiers.view) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.VIEW,
        identifier: name,
        message: `Lengthy view name. Current: ${name.length} Allowed: ${Configs.maxLengthOfIdentifiers.view}.`
      });
    }
    if (newName.length > Configs.maxLengthOfIdentifiers.view) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.VIEW,
        identifier: newName,
        message: `New name of the view is lengthy. Current: ${newName.length} Allowed: ${Configs.maxLengthOfIdentifiers.view}.`
      });
    }
    if (name !== newName) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.VIEW,
        identifier: name,
        message: 'Change the view name.'
      });
    }
    return validations;
  }

  static suggestColumnName(
    tableName: string,
    columnName: string
  ): { newName: string, isCustomIdentifier: boolean } {
    if (Configs.customColumnNames[tableName] && Configs.customColumnNames[tableName][columnName]) {
      return {
        newName: Configs.customColumnNames[tableName][columnName],
        isCustomIdentifier: true
      };
    }
    const result = caseConverter(columnName, Configs.caseTypeOfIdentifiers.column);
    return { newName: result.newIdentifier, isCustomIdentifier: false };
  }

  static validateColumnName(name: string, newName: string) {
    const validations: Validation[] = [];
    if (name.length > Configs.maxLengthOfIdentifiers.column) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.COLUMN,
        identifier: name,
        message: `Lengthy column name. Current: ${name.length} Allowed: ${Configs.maxLengthOfIdentifiers.column}.`
      });
    }
    if (newName.length > Configs.maxLengthOfIdentifiers.column) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.COLUMN,
        identifier: newName,
        message: `New name of the column is lengthy. Current: ${newName.length} Allowed: ${Configs.maxLengthOfIdentifiers.column}.`
      });
    }
    if (name !== newName) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.COLUMN,
        identifier: name,
        message: 'Change the column name.'
      });
    }
    return validations;
  }

  static suggestConstraintName(
    tableName: string,
    newTableName: string,
    constraintName: string,
    newColumnNames: string[],
    constraintType: ConstraintType
  ): { newName: string, isCustomIdentifier: boolean } {
    if (Configs.customConstraintNames[tableName]
        && Configs.customConstraintNames[tableName][constraintName]) {
      return {
        newName: Configs.customConstraintNames[tableName][constraintName],
        isCustomIdentifier: true
      };
    }
    const constructedName = [
      PREFIX.CONSTRAINT[constraintType as ConstraintPrefixType],
      newTableName,
      ...newColumnNames
    ].join('_');
    const result = caseConverter(constructedName, Configs.caseTypeOfIdentifiers.constraint);
    return { newName: result.newIdentifier, isCustomIdentifier: false };
  }

  static validateConstraintName(name: string, newName: string) {
    const validations: Validation[] = [];
    if (name.length > Configs.maxLengthOfIdentifiers.constraint) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.CONSTRAINT,
        identifier: name,
        message: `Lengthy constraint name. Current: ${name.length} Allowed: ${Configs.maxLengthOfIdentifiers.constraint}.`
      });
    }
    if (newName.length > Configs.maxLengthOfIdentifiers.constraint) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.CONSTRAINT,
        identifier: newName,
        message: `New name of the constraint is lengthy. Current: ${newName.length} Allowed: ${Configs.maxLengthOfIdentifiers.constraint}.`
      });
    }
    if (name !== newName) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.CONSTRAINT,
        identifier: name,
        message: 'Change the constraint name.'
      });
    }
    return validations;
  }

  static suggestIndexName(
    tableName: string,
    newTableName: string,
    indexName: string,
    newColumnNames: string[],
    indexType: IndexType
  ): { newName: string, isCustomIdentifier: boolean } {
    if (Configs.customIndexNames[tableName] && Configs.customIndexNames[tableName][indexName]) {
      return {
        newName: Configs.customIndexNames[tableName][indexName],
        isCustomIdentifier: true
      };
    }
    const constructedName = [
      PREFIX.INDEX[indexType as IndexPrefixType],
      newTableName,
      ...newColumnNames
    ].join('_');
    const result = caseConverter(constructedName, Configs.caseTypeOfIdentifiers.index);
    return { newName: result.newIdentifier, isCustomIdentifier: false };
  }

  static validateIndexName(name: string, newName: string) {
    const validations: Validation[] = [];
    if (name.length > Configs.maxLengthOfIdentifiers.index) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.INDEX,
        identifier: name,
        message: `Lengthy index name. Current: ${name.length} Allowed: ${Configs.maxLengthOfIdentifiers.index}.`
      });
    }
    if (newName.length > Configs.maxLengthOfIdentifiers.index) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.INDEX,
        identifier: newName,
        message: `New name of the index is lengthy. Current: ${newName.length} Allowed: ${Configs.maxLengthOfIdentifiers.index}.`
      });
    }
    if (name !== newName) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.INDEX,
        identifier: name,
        message: 'Change the index name.'
      });
    }
    return validations;
  }

  static suggestTriggerName(
    tableName: string,
    newTableName: string,
    triggerName: string,
    newColumnNames: string[],
    triggerTiming: TriggerTiming,
    triggerEvents: TriggerEvent[]
  ): { newName: string, isCustomIdentifier: boolean } {
    if (Configs.customTriggerNames[tableName]
        && Configs.customTriggerNames[tableName][triggerName]) {
      return {
        newName: Configs.customTriggerNames[tableName][triggerName],
        isCustomIdentifier: true
      };
    }
    const constructedName = [
      PREFIX.TRIGGER,
      newTableName,
      triggerTiming,
      ...triggerEvents,
      ...newColumnNames
    ].join('_');
    const result = caseConverter(constructedName, Configs.caseTypeOfIdentifiers.trigger);
    return { newName: result.newIdentifier, isCustomIdentifier: false };
  }

  static validateTriggerName(name: string, newName: string) {
    const validations: Validation[] = [];
    if (name.length > Configs.maxLengthOfIdentifiers.trigger) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.TRIGGER,
        identifier: name,
        message: `Lengthy trigger name. Current: ${name.length} Allowed: ${Configs.maxLengthOfIdentifiers.trigger}.`
      });
    }
    if (newName.length > Configs.maxLengthOfIdentifiers.trigger) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.TRIGGER,
        identifier: newName,
        message: `New name of the trigger is lengthy. Current: ${newName.length} Allowed: ${Configs.maxLengthOfIdentifiers.trigger}.`
      });
    }
    if (name !== newName) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.TRIGGER,
        identifier: name,
        message: 'Change the trigger name.'
      });
    }
    return validations;
  }

  static suggestForeignKeyName(
    tableName: string,
    newTableName: string,
    foreignKeyName: string,
    newColumnNames: string[],
    referenceTableNewName: string,
    referenceTableNewColumNames: string[]
  ): { newName: string, isCustomIdentifier: boolean } {
    if (Configs.customForeignNames[tableName]
            && Configs.customForeignNames[tableName][foreignKeyName]) {
      return {
        newName: Configs.customForeignNames[tableName][foreignKeyName],
        isCustomIdentifier: true
      };
    }
    const constructedName = [
      PREFIX.FOREIGN_KEY,
      newTableName,
      ...newColumnNames,
      referenceTableNewName,
      ...referenceTableNewColumNames
    ].join('_');
    const result = caseConverter(constructedName, Configs.caseTypeOfIdentifiers.foreignKey);
    return { newName: result.newIdentifier, isCustomIdentifier: false };
  }

  static validateForeignKeyName(name: string, newName: string) {
    const validations: Validation[] = [];
    if (name.length > Configs.maxLengthOfIdentifiers.foreignKey) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.FOREIGN_KEY,
        identifier: name,
        message: `Lengthy foreign key name. Current: ${name.length} Allowed: ${Configs.maxLengthOfIdentifiers.foreignKey}.`
      });
    }
    if (newName.length > Configs.maxLengthOfIdentifiers.foreignKey) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.FOREIGN_KEY,
        identifier: newName,
        message: `New name of the foreign key is lengthy. Current: ${newName.length} Allowed: ${Configs.maxLengthOfIdentifiers.foreignKey}.`
      });
    }
    if (name !== newName) {
      validations.push({
        type: ValidationType.ERROR,
        entity: ValidationEntity.FOREIGN_KEY,
        identifier: name,
        message: 'Change the foreign key name.'
      });
    }
    return validations;
  }
}

export default Linter;
