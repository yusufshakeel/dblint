import databaseConnectionFactory from '../connections/database-connection-factory';
import Configs from '../../../configs';
import databaseSchemaFactory from './database-schema-factory';
import { Schema } from '../../../types/database';

export const getSchema = async (): Promise<Schema> => {
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

  try {
    const dbSchema = databaseSchemaFactory(instance);
    const schema = await dbSchema.getSchema();
    await dbConn.closeConnection(instance);
    return schema;
  } catch (error) {
    await dbConn.closeConnection(instance);
    throw error;
  }
};
