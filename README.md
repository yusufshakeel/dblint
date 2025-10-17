# dblint
A simple database linter.

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yusufshakeel/dblint)
[![npm version](https://img.shields.io/badge/npm-0.1.0-blue.svg)](https://www.npmjs.com/package/dblint)
[![npm Downloads](https://img.shields.io/npm/dm/dblint.svg)](https://www.npmjs.com/package/dblint)

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

Set up the database using docker.

```shell
docker-compose up -d
```

Run migrations.

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
