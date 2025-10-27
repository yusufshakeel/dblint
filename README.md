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

# License

It's free :smiley:

[MIT License](https://github.com/yusufshakeel/dblint/blob/main/LICENSE) Copyright (c) 2025 Yusuf Shakeel
