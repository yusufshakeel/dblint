import Configs from '../../../../../src/configs';
import PostgreSQLDatabaseSuggester from '../../../../../src/core/lint/suggesters/PostgreSQLDatabaseSuggester';
import { CaseType } from '../../../../../src/types/case-type';
import { ConstraintType, IndexType, TriggerEvent, TriggerTiming } from '../../../../../src/types/database';

describe('PosrtgreSQLDatabaseSuggester', () => {
  beforeEach(() => {
    jest.spyOn(Configs, 'customTableNames', 'get').mockReturnValue({
      history: 'history'
    });
    jest.spyOn(Configs, 'customViewNames', 'get').mockReturnValue({
      v_history: 'v_history'
    });
    jest.spyOn(Configs, 'customColumnNames', 'get').mockReturnValue({
      history: { bar: 'bar' }
    });
    jest.spyOn(Configs, 'customConstraintNames', 'get').mockReturnValue({
      history: { foo: 'foo' }
    });
    jest.spyOn(Configs, 'customIndexNames', 'get').mockReturnValue({
      history: { foo: 'foo' }
    });
    jest.spyOn(Configs, 'customTriggerNames', 'get').mockReturnValue({
      history: { foo: 'foo' }
    });
    jest.spyOn(Configs, 'customForeignKeyNames', 'get').mockReturnValue({
      history: { foo: 'foo' }
    });
    jest.spyOn(Configs, 'caseTypeOfIdentifiers', 'get').mockReturnValue({
      table: CaseType.SNAKE_CASE,
      column: CaseType.SNAKE_CASE,
      constraint: CaseType.SNAKE_CASE,
      index: CaseType.SNAKE_CASE,
      foreignKey: CaseType.SNAKE_CASE,
      view: CaseType.SNAKE_CASE,
      trigger: CaseType.SNAKE_CASE
    });
  });
    
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('suggestTableName', () => {
    it('should use custom name when available', () => {
      expect(PostgreSQLDatabaseSuggester.suggestTableName('history')).toStrictEqual({
        isCustomIdentifier: true,
        newName: 'history'
      });
    });

    it('should return suggestion', () => {
      expect(PostgreSQLDatabaseSuggester.suggestTableName('users')).toStrictEqual({
        isCustomIdentifier: false,
        newName: 'users'
      });
    });
  });

  describe('suggestViewName', () => {
    it('should use custom name when available', () => {
      expect(PostgreSQLDatabaseSuggester.suggestViewName('v_history', ['table_foo', 'table_bar'])).toStrictEqual({
        isCustomIdentifier: true,
        newName: 'v_history'
      });
    });

    it('should return suggestion', () => {
      expect(PostgreSQLDatabaseSuggester.suggestViewName('buzz', ['table_foo', 'table_bar'])).toStrictEqual({
        isCustomIdentifier: false,
        newName: 'v_table_foo_table_bar'
      });
    });
  });

  describe('suggestColumnName', () => {
    it('should use custom name when available', () => {
      expect(PostgreSQLDatabaseSuggester.suggestColumnName('history', 'bar')).toStrictEqual({
        isCustomIdentifier: true,
        newName: 'bar'
      });
    });

    it('should return suggestion', () => {
      expect(PostgreSQLDatabaseSuggester.suggestColumnName('fizz', 'foo')).toStrictEqual({
        isCustomIdentifier: false,
        newName: 'foo'
      });
    });
  });

  describe('suggestConstraintName', () => {
    it('should use custom name when available', () => {
      expect(
        PostgreSQLDatabaseSuggester.suggestConstraintName(
          'history',
          'histories',
          'foo',
          ['id'],
          ConstraintType.PRIMARY_KEY
        )
      ).toStrictEqual({
        isCustomIdentifier: true,
        newName: 'foo'
      });
    });

    it('should return suggestion - primary key', () => {
      expect(
        PostgreSQLDatabaseSuggester.suggestConstraintName(
          'user',
          'users',
          'user_pkey',
          ['id'],
          ConstraintType.PRIMARY_KEY
        )
      ).toStrictEqual({
        isCustomIdentifier: false,
        newName: 'pk_users_id'
      });
    });

    it('should return suggestion - unique', () => {
      expect(
        PostgreSQLDatabaseSuggester.suggestConstraintName(
          'user',
          'users',
          'user_constraint',
          ['id'],
          ConstraintType.UNIQUE
        )
      ).toStrictEqual({
        isCustomIdentifier: false,
        newName: 'un_users_id'
      });
    });

    it('should return suggestion - check', () => {
      expect(
        PostgreSQLDatabaseSuggester.suggestConstraintName(
          'user',
          'users',
          'user_constraint',
          ['id', 'accountStatus'],
          ConstraintType.CHECK
        )
      ).toStrictEqual({
        isCustomIdentifier: false,
        newName: 'ck_users_id_account_status'
      });
    });

    it('should return suggestion - exclude', () => {
      expect(
        PostgreSQLDatabaseSuggester.suggestConstraintName(
          'user',
          'users',
          'user_constraint',
          ['isOnline'],
          ConstraintType.EXCLUDE
        )
      ).toStrictEqual({
        isCustomIdentifier: false,
        newName: 'ex_users_is_online'
      });
    });

    it('should return suggestion - constraint trigger', () => {
      expect(
        PostgreSQLDatabaseSuggester.suggestConstraintName(
          'user',
          'users',
          'user_constraint',
          ['foo'],
          ConstraintType.CONSTRAINT_TRIGGER
        )
      ).toStrictEqual({
        isCustomIdentifier: false,
        newName: 'tr_users_foo'
      });
    });
  });

  describe('suggestIndexName', () => {
    it('should use custom name when available', () => {
      expect(
        PostgreSQLDatabaseSuggester.suggestIndexName(
          'history',
          'histories',
          'foo',
          ['id'],
          IndexType.UNIQUE_INDEX
        )
      ).toStrictEqual({
        isCustomIdentifier: true,
        newName: 'foo'
      });
    });

    it('should return suggestion - regular index', () => {
      expect(
        PostgreSQLDatabaseSuggester.suggestIndexName(
          'user',
          'users',
          'user_constraint',
          ['id'],
          IndexType.REGULAR_INDEX
        )
      ).toStrictEqual({
        isCustomIdentifier: false,
        newName: 'idx_users_id'
      });
    });

    it('should return suggestion - unique index', () => {
      expect(
        PostgreSQLDatabaseSuggester.suggestIndexName(
          'user',
          'users',
          'user_constraint',
          ['id'],
          IndexType.UNIQUE_INDEX
        )
      ).toStrictEqual({
        isCustomIdentifier: false,
        newName: 'uidx_users_id'
      });
    });

    it('should return suggestion - unique partial index', () => {
      expect(
        PostgreSQLDatabaseSuggester.suggestIndexName(
          'user',
          'users',
          'user_constraint',
          ['id'],
          IndexType.UNIQUE_PARTIAL_INDEX
        )
      ).toStrictEqual({
        isCustomIdentifier: false,
        newName: 'upidx_users_id'
      });
    });

    it('should return suggestion - partial index', () => {
      expect(
        PostgreSQLDatabaseSuggester.suggestIndexName(
          'user',
          'users',
          'user_constraint',
          ['id'],
          IndexType.PARTIAL_INDEX
        )
      ).toStrictEqual({
        isCustomIdentifier: false,
        newName: 'pidx_users_id'
      });
    });
  });

  describe('suggestTriggerName', () => {
    it('should use custom name when available', () => {
      expect(
        PostgreSQLDatabaseSuggester.suggestTriggerName(
          'history',
          'histories',
          'foo',
          ['id'],
          TriggerTiming.BEFORE,
          [TriggerEvent.UPDATE]
        )
      ).toStrictEqual({
        isCustomIdentifier: true,
        newName: 'foo'
      });
    });

    it('should return suggestion', () => {
      expect(
        PostgreSQLDatabaseSuggester.suggestTriggerName(
          'user',
          'users',
          'user_trigger',
          ['id', 'accountStatus'],
          TriggerTiming.BEFORE,
          [TriggerEvent.UPDATE]
        )
      ).toStrictEqual({
        isCustomIdentifier: false,
        newName: 'trg_users_before_update_id_account_status'
      });
    });
  });

  describe('suggestForeignKeyName', () => {
    it('should use custom name when available', () => {
      expect(
        PostgreSQLDatabaseSuggester.suggestForeignKeyName(
          'history',
          'histories',
          'foo',
          ['id'],
          'foo',
          ['id']
        )
      ).toStrictEqual({
        isCustomIdentifier: true,
        newName: 'foo'
      });
    });

    it('should return suggestion', () => {
      expect(
        PostgreSQLDatabaseSuggester.suggestForeignKeyName(
          'user',
          'users',
          'user_fk',
          ['orderId'],
          'orders',
          ['id']
        )
      ).toStrictEqual({
        isCustomIdentifier: false,
        newName: 'fk_users_order_id_orders_id'
      });
    });
  });
});
