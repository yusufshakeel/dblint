import { DatabaseConnection } from './DatabaseConnection';
import { Knex } from 'knex';
import { DatabaseConfig } from '../../../types/database';

class PostgreSQLDatabaseConnection implements DatabaseConnection {
  private knexFn: any;

  constructor(knexFn: any) {
    this.knexFn = knexFn;
  }

  async getConnection({
    dbHost,
    dbName,
    dbUser,
    dbPassword,
    dbPort
  }: DatabaseConfig): Promise<Knex> {
    return this.knexFn({
      client: 'pg',
      connection: {
        host: dbHost,
        database: dbName,
        user: dbUser,
        password: dbPassword,
        port: dbPort
      }
    }) as Knex;
  }

  async closeConnection(instance: Knex) {
    await instance.destroy();
  }
}

export default PostgreSQLDatabaseConnection;
