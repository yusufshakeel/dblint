import { Validation, ValidationEntity, ValidationType } from '../../../types/lint';
import Configs from '../../../configs';

class PostgreSQLLintValidator {
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

export default PostgreSQLLintValidator;
