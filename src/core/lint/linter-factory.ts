import Configs from '../../configs';
import PostgreSQLLinter from './PostgreSQL/PostgreSQLLinter';
import { DatabaseType } from '../../types/database';
import { Linter } from './Linter';

const linterFactory = (): Linter => {
  if (Configs.dbType === DatabaseType.postgres) {
    return new PostgreSQLLinter();
  }
  throw new Error('Unsupported database type');
};

export default linterFactory;
