import { getSchema as getSchemaUnderTest } from '../../../../../src/core/database/schema/schema';
import Configs from '../../../../../src/configs';
import databaseConnectionFactory from '../../../../../src/core/database/connections/database-connection-factory';
import databaseSchemaFactory from '../../../../../src/core/database/schema/database-schema-factory';
import { DatabaseType } from '../../../../../src/types/database';

jest.mock('../../../../../src/core/database/connections/database-connection-factory', () => ({
  __esModule: true,
  'default': jest.fn()
}));

jest.mock('../../../../../src/core/database/schema/database-schema-factory', () => ({
  __esModule: true,
  'default': jest.fn()
}));

describe('Schema.getSchema', () => {
  const mockedConnFactory =
      databaseConnectionFactory as jest.MockedFunction<typeof databaseConnectionFactory>;
  const mockedSchemaFactory =
      databaseSchemaFactory as jest.MockedFunction<typeof databaseSchemaFactory>;

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  function mockConfigs() {
    jest.spyOn(Configs, 'dbHost', 'get').mockReturnValue('host');
    jest.spyOn(Configs, 'dbName', 'get').mockReturnValue('dbname');
    jest.spyOn(Configs, 'dbUser', 'get').mockReturnValue('user');
    jest.spyOn(Configs, 'dbPassword', 'get').mockReturnValue('pass');
    jest.spyOn(Configs, 'dbPort', 'get').mockReturnValue(5432);
    jest.spyOn(Configs, 'dbType', 'get').mockReturnValue(DatabaseType.postgres);
  }

  it('should return schema and orchestrates calls correctly', async () => {
    mockConfigs();

    const instance = { id: 'instance' } as any;
    const getConnection = jest.fn().mockResolvedValue(instance);
    const closeConnection = jest.fn().mockResolvedValue(undefined);
    mockedConnFactory.mockReturnValue({ getConnection, closeConnection } as any);

    const expectedSchema = { tables: [], views: [] };
    const dbGetSchema = jest.fn().mockResolvedValue(expectedSchema);
    mockedSchemaFactory.mockReturnValue({ getSchema: dbGetSchema } as any);

    const schema = await getSchemaUnderTest();

    expect(getConnection).toHaveBeenCalledTimes(1);
    expect(getConnection).toHaveBeenCalledWith({
      dbHost: 'host',
      dbName: 'dbname',
      dbUser: 'user',
      dbPassword: 'pass',
      dbPort: 5432,
      dbType: 'postgres'
    });

    expect(mockedConnFactory).toHaveBeenCalledTimes(1);
    expect(mockedSchemaFactory).toHaveBeenCalledTimes(1);
    expect(mockedSchemaFactory).toHaveBeenCalledWith(instance);

    expect(dbGetSchema).toHaveBeenCalledTimes(1);

    expect(closeConnection).toHaveBeenCalledTimes(1);
    expect(closeConnection).toHaveBeenCalledWith(instance);

    expect(schema).toStrictEqual(expectedSchema);
  });

  it('should propagate error', async () => {
    mockConfigs();

    const instance = { id: 'instance' } as any;
    const getConnection = jest.fn().mockResolvedValue(instance);
    const closeConnection = jest.fn().mockResolvedValue(undefined);
    mockedConnFactory.mockReturnValue({ getConnection, closeConnection } as any);

    const err = new Error('haha');
    const dbGetSchema = jest.fn().mockRejectedValue(err);
    mockedSchemaFactory.mockReturnValue({ getSchema: dbGetSchema } as any);

    await expect(getSchemaUnderTest()).rejects.toThrow(err);

    expect(getConnection).toHaveBeenCalledTimes(1);
    expect(dbGetSchema).toHaveBeenCalledTimes(1);

    expect(closeConnection).toHaveBeenCalledTimes(1);
    expect(closeConnection).toHaveBeenCalledWith(instance);
  });
});
