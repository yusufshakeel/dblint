import PostgreSQLLintValidator from '../../../../../src/core/lint/PostgreSQL/PostgreSQLLintValidator';
import Configs from '../../../../../src/configs';
import { Validation, ValidationEntity, ValidationType } from '../../../../../src/types/lint';

describe('PostrgreSQLLintValidator', () => {
  beforeEach(() => {
    jest.spyOn(Configs, 'maxLengthOfIdentifiers', 'get').mockReturnValue({
      table: 15,
      column: 15,
      constraint: 15,
      index: 15,
      foreignKey: 15,
      view: 15,
      trigger: 15
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('enrichValidationErrorsWithIgnoreReasons', () => {
    it('should enrich validation errors with ignore reasons', () => {
      jest.spyOn(Configs,'ignoreValidationErrors', 'get').mockReturnValue({
        history: {
          'ERROR,TABLE,history': "Won't change the table name."
        }
      });
      const validations: Validation[] = [
        {
          type: ValidationType.INFO,
          entity: ValidationEntity.TABLE,
          identifier: 'history',
          message: 'Some message'
        },
        {
          type: ValidationType.ERROR,
          entity: ValidationEntity.TABLE,
          identifier: 'history',
          message: 'Some message'
        },
        {
          type: ValidationType.ERROR,
          entity: ValidationEntity.FOREIGN_KEY,
          identifier: 'user_fkey',
          message: 'Some message'
        }
      ];
      expect(
        PostgreSQLLintValidator.enrichValidationErrorsWithIgnoreReasons(
          'history',
          validations
        )
      ).toStrictEqual([
        {
          type: ValidationType.INFO,
          entity: ValidationEntity.TABLE,
          identifier: 'history',
          message: 'Some message'
        },
        {
          type: ValidationType.ERROR,
          entity: ValidationEntity.TABLE,
          identifier: 'history',
          message: 'Some message',
          isIgnored: true,
          ignoredReason: "Won't change the table name."
        },
        {
          type: ValidationType.ERROR,
          entity: ValidationEntity.FOREIGN_KEY,
          identifier: 'user_fkey',
          message: 'Some message'
        }
      ]);
    });
  });

  describe('validateTableName', () => {
    it('should return validations', () => {
      expect(PostgreSQLLintValidator.validateTableName('user', 'users')).toStrictEqual([
        {
          entity: 'TABLE',
          identifier: 'user',
          message: 'Change the table name.',
          type: 'ERROR'
        }
      ]);
    });

    it('should return empty validations when there is no issue', () => {
      expect(PostgreSQLLintValidator.validateTableName('users', 'users')).toStrictEqual([]);
    });

    it('should return validations when name is lengthy', () => {
      expect(PostgreSQLLintValidator.validateTableName('VeryLengthyTableName', 'VeryLengthyTableNames')).toStrictEqual([
        {
          entity: 'TABLE',
          identifier: 'VeryLengthyTableName',
          message: 'Lengthy table name. Current: 20 Allowed: 15.',
          type: 'ERROR'
        },
        {
          entity: 'TABLE',
          identifier: 'VeryLengthyTableNames',
          message: 'New name of the table is lengthy. Current: 21 Allowed: 15.',
          type: 'ERROR'
        },
        {
          entity: 'TABLE',
          identifier: 'VeryLengthyTableName',
          message: 'Change the table name.',
          type: 'ERROR'
        }
      ]);
    });
  });

  describe('validateViewName', () => {
    it('should return validations', () => {
      expect(PostgreSQLLintValidator.validateViewName('user', 'v_users')).toStrictEqual([
        {
          entity: 'VIEW',
          identifier: 'user',
          message: 'Change the view name.',
          type: 'ERROR'
        }
      ]);
    });

    it('should return empty validations when there is no issue', () => {
      expect(PostgreSQLLintValidator.validateViewName('v_users', 'v_users')).toStrictEqual([]);
    });

    it('should return validations when name is lengthy', () => {
      expect(PostgreSQLLintValidator.validateViewName('v_VeryLengthyViewName', 'v_VeryLengthyViewName')).toStrictEqual([
        {
          entity: 'VIEW',
          identifier: 'v_VeryLengthyViewName',
          message: 'Lengthy view name. Current: 21 Allowed: 15.',
          type: 'ERROR'
        },
        {
          entity: 'VIEW',
          identifier: 'v_VeryLengthyViewName',
          message: 'New name of the view is lengthy. Current: 21 Allowed: 15.',
          type: 'ERROR'
        }
      ]);
    });
  });

  describe('validateColumnName', () => {
    it('should return validations', () => {
      expect(PostgreSQLLintValidator.validateColumnName('id', 'Id')).toStrictEqual([
        {
          entity: 'COLUMN',
          identifier: 'id',
          message: 'Change the column name.',
          type: 'ERROR'
        }
      ]);
    });

    it('should return empty validations when there is no issue', () => {
      expect(PostgreSQLLintValidator.validateColumnName('id', 'id')).toStrictEqual([]);
    });

    it('should return validations when name is lengthy', () => {
      expect(PostgreSQLLintValidator.validateColumnName('√eryLengthyColumnName', 'VeryLengthyColumnName')).toStrictEqual([
        {
          entity: 'COLUMN',
          identifier: '√eryLengthyColumnName',
          message: 'Lengthy column name. Current: 21 Allowed: 15.',
          type: 'ERROR'
        },
        {
          entity: 'COLUMN',
          identifier: 'VeryLengthyColumnName',
          message: 'New name of the column is lengthy. Current: 21 Allowed: 15.',
          type: 'ERROR'
        },
        {
          entity: 'COLUMN',
          identifier: '√eryLengthyColumnName',
          message: 'Change the column name.',
          type: 'ERROR'
        }
      ]);
    });
  });

  describe('validateConstraintName', () => {
    it('should return validations', () => {
      expect(PostgreSQLLintValidator.validateConstraintName('id_pkey', 'pk_users_id')).toStrictEqual([
        {
          entity: 'CONSTRAINT',
          identifier: 'id_pkey',
          message: 'Change the constraint name.',
          type: 'ERROR'
        }
      ]);
    });

    it('should return empty validations when there is no issue', () => {
      expect(PostgreSQLLintValidator.validateConstraintName('pkey_users_id', 'pkey_users_id')).toStrictEqual([]);
    });

    it('should return validations when name is lengthy', () => {
      expect(PostgreSQLLintValidator.validateConstraintName('√eryLengthyColumnName', 'un_users_a_very_length_column_name')).toStrictEqual([
        {
          entity: 'CONSTRAINT',
          identifier: '√eryLengthyColumnName',
          message: 'Lengthy constraint name. Current: 21 Allowed: 15.',
          type: 'ERROR'
        },
        {
          entity: 'CONSTRAINT',
          identifier: 'un_users_a_very_length_column_name',
          message: 'New name of the constraint is lengthy. Current: 34 Allowed: 15.',
          type: 'ERROR'
        },
        {
          entity: 'CONSTRAINT',
          identifier: '√eryLengthyColumnName',
          message: 'Change the constraint name.',
          type: 'ERROR'
        }
      ]);
    });
  });

  describe('validateIndexName', () => {
    it('should return validations', () => {
      expect(PostgreSQLLintValidator.validateIndexName('index_id', 'idx_id')).toStrictEqual([
        {
          entity: 'INDEX',
          identifier: 'index_id',
          message: 'Change the index name.',
          type: 'ERROR'
        }
      ]);
    });

    it('should return empty validations when there is no issue', () => {
      expect(PostgreSQLLintValidator.validateIndexName('uidx_id', 'uidx_id')).toStrictEqual([]);
    });

    it('should return validations when name is lengthy', () => {
      expect(PostgreSQLLintValidator.validateIndexName('idx√eryLengthyColumnName', 'idx_users_a_very_length_column_name')).toStrictEqual([
        {
          entity: 'INDEX',
          identifier: 'idx√eryLengthyColumnName',
          message: 'Lengthy index name. Current: 24 Allowed: 15.',
          type: 'ERROR'
        },
        {
          entity: 'INDEX',
          identifier: 'idx_users_a_very_length_column_name',
          message: 'New name of the index is lengthy. Current: 35 Allowed: 15.',
          type: 'ERROR'
        },
        {
          entity: 'INDEX',
          identifier: 'idx√eryLengthyColumnName',
          message: 'Change the index name.',
          type: 'ERROR'
        }
      ]);
    });
  });

  describe('validateTriggerName', () => {
    it('should return validations', () => {
      expect(PostgreSQLLintValidator.validateTriggerName('trigger_foo', 'trg_foo')).toStrictEqual([
        {
          entity: 'TRIGGER',
          identifier: 'trigger_foo',
          message: 'Change the trigger name.',
          type: 'ERROR'
        }
      ]);
    });

    it('should return empty validations when there is no issue', () => {
      expect(PostgreSQLLintValidator.validateTriggerName('trg_foo', 'trg_foo')).toStrictEqual([]);
    });

    it('should return validations when name is lengthy', () => {
      expect(PostgreSQLLintValidator.validateTriggerName('trg_√eryLengthyColumnName', 'trg_users_a_very_length_column_name')).toStrictEqual([
        {
          entity: 'TRIGGER',
          identifier: 'trg_√eryLengthyColumnName',
          message: 'Lengthy trigger name. Current: 25 Allowed: 15.',
          type: 'ERROR'
        },
        {
          entity: 'TRIGGER',
          identifier: 'trg_users_a_very_length_column_name',
          message: 'New name of the trigger is lengthy. Current: 35 Allowed: 15.',
          type: 'ERROR'
        },
        {
          entity: 'TRIGGER',
          identifier: 'trg_√eryLengthyColumnName',
          message: 'Change the trigger name.',
          type: 'ERROR'
        }
      ]);
    });
  });

  describe('validateForeignKeyName', () => {
    it('should return validations', () => {
      expect(PostgreSQLLintValidator.validateForeignKeyName('foo', 'fk_foo')).toStrictEqual([
        {
          entity: 'FOREIGN_KEY',
          identifier: 'foo',
          message: 'Change the foreign key name.',
          type: 'ERROR'
        }
      ]);
    });

    it('should return empty validations when there is no issue', () => {
      expect(PostgreSQLLintValidator.validateForeignKeyName('fk_foo', 'fk_foo')).toStrictEqual([]);
    });

    it('should return validations when name is lengthy', () => {
      expect(PostgreSQLLintValidator.validateForeignKeyName('fk_√eryLengthyColumnName', 'fk_users_a_very_length_column_name')).toStrictEqual([
        {
          entity: 'FOREIGN_KEY',
          identifier: 'fk_√eryLengthyColumnName',
          message: 'Lengthy foreign key name. Current: 24 Allowed: 15.',
          type: 'ERROR'
        },
        {
          entity: 'FOREIGN_KEY',
          identifier: 'fk_users_a_very_length_column_name',
          message: 'New name of the foreign key is lengthy. Current: 34 Allowed: 15.',
          type: 'ERROR'
        },
        {
          entity: 'FOREIGN_KEY',
          identifier: 'fk_√eryLengthyColumnName',
          message: 'Change the foreign key name.',
          type: 'ERROR'
        }
      ]);
    });
  });
});
