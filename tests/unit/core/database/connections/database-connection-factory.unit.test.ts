import databaseConnectionFactory from '../../../../../src/core/database/connections/database-connection-factory';
import Configs from '../../../../../src/configs';
import { DatabaseType } from '../../../../../src/types/database';
import PostgreSQLDatabaseConnection from '../../../../../src/core/database/connections/PostgreSQLDatabaseConnection';

describe('DatabaseConnectionFactory', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should throw error for invalid database type', () => {
    jest.spyOn(Configs, 'dbType', 'get').mockReturnValue('unknown' as DatabaseType);
    expect(() => databaseConnectionFactory()).toThrow('Unsupported database type');
  });

  it('should return postgres connection class when database type is postgres', () => {
    jest.spyOn(Configs, 'dbType', 'get').mockReturnValue(DatabaseType.postgres);
    const dbCon = databaseConnectionFactory();
    expect(dbCon).toBeInstanceOf(PostgreSQLDatabaseConnection);
  });
});
