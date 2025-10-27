import Configs from '../../configs';
import PostgreSQLDatabaseLinter from './PostgreSQLDatabaseLinter';
import { DatabaseType } from '../../types/database';
import { Linter } from './Linter';

const linterFactory = (): Linter => {
  if (Configs.dbType === DatabaseType.postgres) {
    return new PostgreSQLDatabaseLinter();
  }
  throw new Error('Unsupported database type');
};

export default linterFactory;
