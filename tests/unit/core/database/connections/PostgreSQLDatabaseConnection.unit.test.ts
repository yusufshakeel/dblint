import { Knex } from 'knex';
import Configs from '../../../../../src/configs';
import { DatabaseType } from '../../../../../src/types/database';
import PostgreSQLDatabaseConnection from '../../../../../src/core/database/connections/PostgreSQLDatabaseConnection';

describe('PostgreSQLDatabaseConnection', () => {
  const knexFn = jest.fn();
  const knexFailureFn = () => { throw new Error('Failed to connect to database!'); };
  const databaseConfig = {
    dbName: 'test_db',
    dbHost: 'localhost',
    dbPort: 5432,
    dbType: DatabaseType.postgres,
    dbUser: 'username',
    dbPassword: 'password'
  };

  beforeEach(() => {
    jest.spyOn(Configs, 'dbType', 'get').mockReturnValue(DatabaseType.postgres);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be able to get connection', async () => {
    await new PostgreSQLDatabaseConnection(knexFn).getConnection(databaseConfig);
    expect(knexFn).toHaveBeenCalled();
  });

  it('should throw error if failed to establish connection', async () => {
    await expect(() => new PostgreSQLDatabaseConnection(knexFailureFn).getConnection(databaseConfig)).rejects.toThrow('Failed to connect to database!');
  });

  it('should be able to close connection', async () => {
    const instance = { destroy: jest.fn() } as unknown as Knex;
    await new PostgreSQLDatabaseConnection(knexFn).closeConnection(instance);
    expect(instance.destroy).toHaveBeenCalled();
  });
});
