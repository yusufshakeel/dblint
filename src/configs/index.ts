import { DatabaseType } from '../types/database';

class Configs {
  get dbType(): DatabaseType {
    return process.env.DBLINT_DATABASE_TYPE as DatabaseType;
  }

  get dbName(): string {
    return process.env.DBLINT_DATABASE_NAME || '';
  }

  get dbUser(): string {
    return process.env.DBLINT_DATABASE_USER || '';
  }

  get dbPassword(): string {
    return process.env.DBLINT_DATABASE_PASSWORD || '';
  }

  get dbHost(): string {
    return process.env.DBLINT_DATABASE_HOST || 'localhost';
  }

  get dbPort(): number {
    return parseInt(process.env.DBLINT_DATABASE_PORT || '5432');
  }

  get ignoreTables(): string[] {
    return JSON.parse(process.env.DBLINT_IGNORE_TABLES || '[]');
  }
}

export default new Configs();
