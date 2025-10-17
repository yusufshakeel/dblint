export enum DatabaseType {
    postgres = 'postgres'
}

export type DatabaseConfig = {
    dbName: string;
    dbUser: string;
    dbPassword: string;
    dbHost: string;
    dbPort: number;
    dbType: DatabaseType;
}
