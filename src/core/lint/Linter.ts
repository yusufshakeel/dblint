import pluralize from 'pluralize';
import databaseConnectionFactory from '../database/connections/database-connection-factory';
import Configs from '../../configs';
import databaseSchemaFactory from '../database/schema/database-schema-factory';
import { Lint, LintedSchema, LintTable, Validation, ValidationEntity, ValidationType } from '../../types/lint';
import { Column, Schema, Table, View } from '../../types/database';
import caseConverter from '../case-converter';

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
    const oldToNewTableNameMap: Record<string, string> = {};
    const oldToNewColumnNameMap: Record<string, Record<string, string>> = {};

    const lintedTables = schema.tables.map((table: Table) => {
      const { name } = table;
      const { newName, isCustomIdentifier } = this.suggestTableName(name);
      const validations = isCustomIdentifier ? [] : this.validateTableName(name, newName);
      oldToNewTableNameMap[name] = newName;

      const lintedColumns = table.columns.map((column: Column) => {
        const newColumnNameResult = this.suggestColumnName(newName, column.name);
        oldToNewColumnNameMap[newName] = { [column.name]: newColumnNameResult.newName };

        const columnValidations = isCustomIdentifier
          ? []
          : this.validateColumnName(column.name, newColumnNameResult.newName);

        validations.push(...columnValidations);

        return {
          details: {
            name: column.name,
            newName: newColumnNameResult.newName,
            isCustomIdentifier: newColumnNameResult.isCustomIdentifier
          }
        };
      });

      return {
        details: {
          name,
          newName,
          isCustomIdentifier
        },
        columns: lintedColumns,
        validations
      };
    });

    const lintedViews = schema.views.map((view: View) => {
      const { name, tableNames } = view;
      const newTableNames = tableNames.map(tableName => oldToNewTableNameMap[tableName]);
      const { newName, isCustomIdentifier } = this.suggestViewName(name, newTableNames);
      const validations = isCustomIdentifier ? [] : this.validateViewName(name, newName);
      return {
        details: {
          name,
          newName,
          isCustomIdentifier
        },
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
    const constructedName = 'v_' + tableNames.join('_');
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
}

export default Linter;
