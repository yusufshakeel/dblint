import Configs from '../../../configs';
import caseConverter from '../../case-converter';
import pluralize from 'pluralize';
import { ConstraintPrefixType, IndexPrefixType, PREFIX } from '../../../constants/prefix';
import { ConstraintType, IndexType, TriggerEvent, TriggerTiming } from '../../../types/database';

class PostgreSQLDatabaseSuggester {
  static suggestTableName(
    name: string
  ): { newName: string, isCustomIdentifier: boolean } {
    if (Configs.customTableNames[name]) {
      return { newName: Configs.customTableNames[name], isCustomIdentifier: true };
    }
    const result = caseConverter(pluralize.plural(name), Configs.caseTypeOfIdentifiers.table);
    return { newName: result.newIdentifier, isCustomIdentifier: false };
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
}

export default PostgreSQLDatabaseSuggester;
