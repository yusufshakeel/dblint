import Configs from '../../../../src/configs';
import { DatabaseType } from '../../../../src/types/database';
import linterFactory from '../../../../src/core/lint/linter-factory';
import PostgreSQLLinter from '../../../../src/core/lint/PostgreSQL/PostgreSQLLinter';

describe('LinterFactory', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should throw error for invalid database type', () => {
    jest.spyOn(Configs, 'dbType', 'get').mockReturnValue('unknown' as DatabaseType);
    expect(() => linterFactory()).toThrow('Unsupported database type');
  });

  it('should return postgres linter class when database type is postgres', () => {
    jest.spyOn(Configs, 'dbType', 'get').mockReturnValue(DatabaseType.postgres);
    const linter = linterFactory();
    expect(linter).toBeInstanceOf(PostgreSQLLinter);
  });
});
