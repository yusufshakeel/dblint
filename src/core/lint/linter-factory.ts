import Configs from '../../configs';
import PostgreSQLDatabaseLinter from './PostgreSQLDatabaseLinter';
import { DatabaseType } from '../../types/database';

const linterFactory = () => {
  if (Configs.dbType === DatabaseType.postgres) {
    return new PostgreSQLDatabaseLinter();
  }
  throw new Error('Unsupported database type');
};

export default linterFactory;
