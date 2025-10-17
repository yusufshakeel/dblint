const host = process.env.DATABASE_HOST || 'localhost';
const database = process.env.DATABASE_NAME || 'testdb';
const user = process.env.DATABASE_USER || 'username';
const password = process.env.DATABASE_PASSWORD || 'password';
const port = process.env.DATABASE_PORT || 5432;

console.log('[postgres config] Using database configuration:', {
    host,
    database,
    user,
    password: password[0] + '**REDACTED**',
    port
});

module.exports = {
    client: 'pg',
    connection: {
        host,
        database,
        user,
        password,
        port,
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        directory: './db/postgres/migrations',
        tableName: 'knex_migrations'
    }
}