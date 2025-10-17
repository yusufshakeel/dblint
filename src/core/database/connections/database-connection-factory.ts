import { DatabaseConnection } from './DatabaseConnection';
import PostgreSQLDatabaseConnection from './PostgreSQLDatabaseConnection';
import Configs from '../../../configs';
import { DatabaseType } from '../../../types/database';
import { knex } from 'knex';

const databaseConnectionFactory = (): DatabaseConnection => {
  if (Configs.dbType === DatabaseType.postgres) {
    return new PostgreSQLDatabaseConnection(knex);
  }
  throw new Error('Unsupported database type');
};

export default databaseConnectionFactory;
