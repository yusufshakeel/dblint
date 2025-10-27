# dblint
A simple database linter.

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yusufshakeel/dblint)
[![npm version](https://img.shields.io/npm/v/dblint.svg)](https://www.npmjs.com/package/dblint)
[![npm Downloads](https://img.shields.io/npm/dm/dblint.svg)](https://www.npmjs.com/package/dblint)

# Use Case

- Install it as a dev dependency and run it as a pre-commit hook in your project or in your CI/CD pipeline.
- Check for database naming inconsistencies and violations.
- Get name suggestions for tables, columns, etc.

# Supported Databases
* PostgreSQL

# Table of Contents
* [Prerequisites](#prerequisites)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Ignore Validation Errors](#ignore-validation-errors)
* [License](#license)

# Prerequisites
* Node.js >= 22.0.0
* PostgreSQL >= 13.0
* Dbeaver >= 24.0.0 (or any other database client)
* Docker
* Git
* IDE anyOf: WebStorm, VSCode, etc.

# Getting Started

Clone the repository.

```shell
git clone https://github.com/yusufshakeel/dblint.git
```

Install the package using npm.

```shell
npm i
```

## Automated

Run everything using containers.

The following command will run the shell scripts present inside the [scripts](./scripts) directory.

```shell
npm run all:containers
```

## Manual

Copy the `.env.example` file to `.env` and update the values.

```shell
cp .env.example .env
```

Source the `.env` file.

```shell
source .env
```

If you are planning to use Docker then run the following. Else you can use your local database instance.

Refer: [docker-compose.yml](./docker-compose.yml)

```shell
docker-compose up -d
```

After creating the database **dblint_test_db** run the database migration.

```shell
npm run db:postgres:migrate
```

Bootstrap, lint, test.

```shell
npm run all
```

# Environment Variables

Refer: [.env.example](./.env.example)

```shell
# Set the database type
# allowed values: postgres
# default: postgres
export DBLINT_DB_TYPE=postgres

# Set the databse name
export DBLINT_DATABASE_NAME=dblint_test_db

# Set the database username
# default: ''
export DBLINT_DATABASE_USER=

# Set the database password
# default: ''
export DBLINT_DATABASE_PASSWORD=

# Set the database host
# default: localhost
export DBLINT_DATABASE_HOST=localhost

# Set the database port
# default: 5432
export DBLINT_DATABASE_PORT=5432

# Set the tables names to ignore
# default: '["knex_migrations","knex_migrations_lock"]'
export DBLINT_IGNORE_TABLES='["knex_migrations","knex_migrations_lock"]'

# Set the default max length for the different identifiers
# default: 50
export DBLINT_DEFAULT_MAXLENGTH_OF_IDENTIFIERS=50

# Set the max length for the different identifiers
# If this is not set then DBLINT_DEFAULT_MAXLENGTH_OF_IDENTIFIERS will be used.
# default: '{"table": 50, "column": 50, "constraint": 50, "index": 50, "foreignKey": 50, "view": 50, "trigger": 50}'
export DBLINT_MAXLENGTH_OF_IDENTIFIERS='{"table": 50, "column": 50, "constraint": 50, "index": 50, "foreignKey": 50, "view": 50, "trigger": 50}'

# Set the default case for the different identifiers
# allowed values: SNAKE_CASE, CAMEL_CASE, PASCAL_CASE
# default: SNAKE_CASE
export DBLINT_DEFAULT_CASE_TYPE_OF_IDENTIFIERS=SNAKE_CASE

# Set the case for the different identifiers
# If this is not set then DBLINT_DEFAULT_CASE_TYPE_OF_IDENTIFIERS will be used.
# default: '{"table": "SNAKE_CASE", "column": "SNAKE_CASE", "constraint": "SNAKE_CASE", "index": "SNAKE_CASE", "foreignKey": "SNAKE_CASE", "view": "SNAKE_CASE", "trigger": "SNAKE_CASE"}'
export DBLINT_CASE_TYPE_OF_IDENTIFIERS='{"table": "SNAKE_CASE", "column": "SNAKE_CASE", "constraint": "SNAKE_CASE", "index": "SNAKE_CASE", "foreignKey": "SNAKE_CASE", "view": "SNAKE_CASE", "trigger": "SNAKE_CASE"}'

# Set the custom table names
# This will name the `current` table name to the `new` table name.
# If you want a custom name then set both the `current` and `new` name as same.
# syntax: '{"<current_table_name>": "<new_table_name>"}'
# example: '{"history": "history"}'
# default: '{}'
export DBLINT_CUSTOM_TABLE_NAMES='{}'

# Set the custom view names
# This will name the `current` view name to the `new` view name.
# If you want a custom name then set both the `current` and `new` name as same.
# syntax: '{"<current_view_name>": "<new_view_name>"}'
# example: '{"v_history": "v_history"}'
# default: '{}'
export DBLINT_CUSTOM_VIEW_NAMES='{}'

# Set the custom column names
# This will name the `current` column name to the `new` column name for a given `current` table name.
# If you want a custom name then set both the `current` and `new` name as same.
# syntax: '{"<current_table_name>": {"<current_column_name>": "<new_column_name>"}}'
# example: '{"users": {"id": "id"}}'
# default: '{}'
export DBLINT_CUSTOM_COLUMN_NAMES='{}'

# Set the custom constraint names
# This will name the `current` constraint name to the `new` constraint name for a given `current` table name.
# If you want a custom name then set both the `current` and `new` name as same.
# syntax: '{"<current_table_name>": {"<current_constraint_name>": "<new_constraint_name>"}}'
# example: '{"users": {"user_pkey": "user_pkey"}}'
# default: '{}'
export DBLINT_CUSTOM_CONSTRAINT_NAMES='{}'

# Set the custom index names
# This will name the `current` index name to the `new` index name for a given `current` table name.
# If you want a custom name then set both the `current` and `new` name as same.
# syntax: '{"<current_table_name>": {"<current_index_name>": "<new_index_name>"}}'
# example: '{"users": {"user_id_idx": "user_id_idx"}}'
# default: '{}'
export DBLINT_CUSTOM_INDEX_NAMES='{}'

# Set the custom trigger names
# This will name the `current` trigger name to the `new` trigger name for a given `current` table name.
# If you want a custom name then set both the `current` and `new` name as same.
# syntax: '{"<current_table_name>": {"<current_trigger_name>": "<new_trigger_name>"}}'
# example: '{"users": {"user_trg": "user_trg"}}'
# default: '{}'
export DBLINT_CUSTOM_TRIGGER_NAMES='{}'

# Set the custom foreign key names
# This will name the `current` foreign key name to the `new` foreign key name for a given `current` table name.
# If you want a custom name then set both the `current` and `new` name as same.
# syntax: '{"<current_table_name>": {"<current_foreign_key_name>": "<new_foreign_key_name>"}}'
# example: '{"users": {"user_fkey": "user_fkey"}}'
# default: '{}'
export DBLINT_CUSTOM_FOREIGN_KEY_NAMES='{}'

# set the ignore validation errors
# syntax: '{"<current_table_or_view_name>": {"<type>,<entity>,<identifier>": "<ignore_reason>"}}'
# default: '{}'
export DBLINT_IGNORE_VALIDATION_ERRORS='{}'
```

# Ignore Validation Errors

You can ignore validation errors by setting the `DBLINT_IGNORE_VALIDATION_ERRORS` environment variable.

```json
{
  "<current_table_or_view_name>": {
    "<type>,<entity>,<identifier>": "<ignore_reason>"
  }
}
```

Where,
- Allowed values for `<type>`: `ERROR`, `WARNING`, `INFO`
- Allowed values for `<entity>`: `TABLE`, `COLUMN`, `CONSTRAINT`, `INDEX`, `FOREIGN_KEY`, `VIEW`, `TRIGGER`
- Allowed values for `<identifier>`: The value that appears in the dblint report.
- Allowed values for `<ignore_reason>`: string.

Example:
```json
{
  "history": {
    "ERROR,TABLE,history": "Ignore the table name change."
  }
}
```


# License

It's free :smiley:

[MIT License](https://github.com/yusufshakeel/dblint/blob/main/LICENSE) Copyright (c) 2025 Yusuf Shakeel
