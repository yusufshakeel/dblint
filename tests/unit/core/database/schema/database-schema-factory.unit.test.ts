import Configs from '../../../../../src/configs';
import { DatabaseType } from '../../../../../src/types/database';
import databaseSchemaFactory from '../../../../../src/core/database/schema/database-schema-factory';
import { DatabaseInstance } from '../../../../../src/core/database/connections/DatabaseConnection';
import PostgreSQLDatabaseSchema from '../../../../../src/core/database/schema/PostgreSQLDatabaseSchema';

describe('DatabaseSchemaFactory', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  const dbInstance = {} as DatabaseInstance;

  it('should throw error for invalid database type', () => {
    jest.spyOn(Configs, 'dbType', 'get').mockReturnValue('unknown' as DatabaseType);
    expect(() => databaseSchemaFactory(dbInstance)).toThrow('Unsupported database type');
  });

  it('should return postgres schema class when database type is postgres', () => {
    jest.spyOn(Configs, 'dbType', 'get').mockReturnValue(DatabaseType.postgres);
    const schema = databaseSchemaFactory(dbInstance);
    expect(schema).toBeInstanceOf(PostgreSQLDatabaseSchema);
  });
});
