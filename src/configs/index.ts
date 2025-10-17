import { DatabaseType } from '../types/database';

class Configs {
  get dbType(): DatabaseType {
    return process.env.DATABASE_TYPE as DatabaseType;
  }

  get dbName(): string {
    return process.env.DATABASE_NAME || '';
  }

  get dbUser(): string {
    return process.env.DATABASE_USER || '';
  }

  get dbPassword(): string {
    return process.env.DATABASE_PASSWORD || '';
  }

  get dbHost(): string {
    return process.env.DATABASE_HOST || 'localhost';
  }

  get dbPort(): number {
    return parseInt(process.env.DATABASE_PORT || '5432');
  }
}

export default new Configs();
