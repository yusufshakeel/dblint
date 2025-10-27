#!/bin/sh
set -e

export NODE_ENV=development

# database
export POSTGRES_DB=dblint_test_db
export POSTGRES_USER=username
export POSTGRES_PASSWORD=password
export POSTGRES_PORT=15432

export DBLINT_DATABASE_NAME=$POSTGRES_DB
export DBLINT_DATABASE_USER=$POSTGRES_USER
export DBLINT_DATABASE_PASSWORD=$POSTGRES_PASSWORD
export DBLINT_DATABASE_HOST=localhost
export DBLINT_DATABASE_PORT=$POSTGRES_PORT
export DBLINT_DATABASE_TYPE=postgres

export DBLINT_IGNORE_TABLES='["knex_migrations","knex_migrations_lock"]'
export DBLINT_DEFAULT_MAXLENGTH_OF_IDENTIFIERS='50'
export DBLINT_MAXLENGTH_OF_IDENTIFIERS='{}'
export DBLINT_DEFAULT_CASE_TYPE_OF_IDENTIFIERS='SNAKE_CASE'
export DBLINT_CASE_TYPE_OF_IDENTIFIERS='{}'
export DBLINT_CUSTOM_TABLE_NAMES='{}'
export DBLINT_CUSTOM_VIEW_NAMES='{}'
export DBLINT_CUSTOM_COLUMN_NAMES='{}'
export DBLINT_CUSTOM_CONSTRAINT_NAMES='{}'
export DBLINT_CUSTOM_INDEX_NAMES='{}'
export DBLINT_CUSTOM_TRIGGER_NAMES='{}'
export DBLINT_CUSTOM_FOREIGN_KEY_NAMES='{}'
export DBLINT_IGNORE_VALIDATION_ERRORS='{}'

# Define cleanup function
cleanup() {
  echo "🧹 Shutting down Docker containers..."
  docker compose down
}
# Ensure cleanup runs no matter what
trap cleanup EXIT

echo "🚀 Starting Docker containers..."
docker compose up -d

echo "⏳ Waiting for PostgreSQL to be ready..."
until docker exec dblint-postgres pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" > /dev/null 2>&1; do
  printf "."
  sleep 1
done
echo "\n✅ PostgreSQL is ready!"

echo "⚙️ Running database migrations..."
npm run db:postgres:migrate

echo "🏃 Running different tasks..."
npm run all
npx ts-node src/index.ts | true

echo "🎉 All steps completed successfully!"
