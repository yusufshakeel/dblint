import DatabaseSchema from './DatabaseSchema';
import Configs from '../../../configs';
import { DatabaseType } from '../../../types/database';
import PostgreSQLDatabaseSchema from './PostgreSQLDatabaseSchema';
import { DatabaseInstance } from '../connections/DatabaseConnection';
import { Knex } from 'knex';

const databaseSchemaFactory = (dbInstance: DatabaseInstance): DatabaseSchema => {
  if (Configs.dbType === DatabaseType.postgres) {
    return new PostgreSQLDatabaseSchema(dbInstance as Knex);
  }
  throw new Error('Unsupported database type');
};

export default databaseSchemaFactory;
