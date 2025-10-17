import { DatabaseConfig } from '../../../types/database';
import { Knex } from 'knex';

export interface DatabaseConnection {
    getConnection: (config: DatabaseConfig) => Promise<Knex>;
    closeConnection: (instance: Knex) => Promise<void>;
}
