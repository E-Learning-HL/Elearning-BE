# Odin backend eLearning Platform

![github action status](https://github.com/brocoders/nestjs-boilerplate/actions/workflows/docker-e2e.yml/badge.svg)
[![renovate](https://img.shields.io/badge/renovate-enabled-%231A1F6C?logo=renovatebot)](https://app.renovatebot.com/dashboard)

## Description <!-- omit in toc -->

This NestJS REST API purposes on developing an e-learning platform for students all over the world.

[Link to this repository](https://github.com/baole1998/Odin-eLearning-BE-JS)

## Table of Contents <!-- omit in toc -->

- [Features](#features)
- [Quick run](#quick-run)
- [Comfortable development](#comfortable-development)
- [Links](#links)
- [Automatic update of dependencies](#automatic-update-of-dependencies)
- [Database utils](#database-utils)
- [Tests](#tests)
- [Tests in Docker](#tests-in-docker)
- [Test benchmarking](#test-benchmarking)
- [Coding convention](#coding-convention)

## Features

- [x] Database ([typeorm](https://www.npmjs.com/package/typeorm)).
- [x] Seeding.
- [x] Config Service ([@nestjs/config](https://www.npmjs.com/package/@nestjs/config)).
- [x] Mailing ([nodemailer](https://www.npmjs.com/package/nodemailer)).
- [x] Sign in and sign up via email.
- [x] Social sign in (Apple, Facebook, Google, Twitter).
- [x] Admin and User roles.
- [x] I18N ([nestjs-i18n](https://www.npmjs.com/package/nestjs-i18n)).
- [x] File uploads. Support local and Amazon S3 drivers.
- [x] Swagger.
- [x] E2E and units tests.
- [x] Docker.
- [x] CI (Github Actions).

## Quick run

```bash
git clone --depth 1 https://github.com/brocoders/nestjs-boilerplate.git my-app
cd my-app/
cp env-example .env
docker compose up -d
```

For check status run

```bash
docker compose logs
```

## Comfortable development

```bash
git clone --depth 1 https://github.com/brocoders/nestjs-boilerplate.git my-app
cd my-app/
cp env-example .env
```

Change `DATABASE_HOST=postgres` to `DATABASE_HOST=localhost`

Change `MAIL_HOST=maildev` to `MAIL_HOST=localhost`

Run additional container:

```bash
docker compose up -d postgres adminer maildev
```

```bash
npm install

npm run migration:run

npm run seed:run

npm run start:dev
```

## Links

- Swagger: <http://localhost:3000/api/docs>
- Adminer (client for DB): <http://localhost:8080>
- Maildev: <http://localhost:1080>

## Automatic update of dependencies

If you want to automatically update dependencies, you can connect [Renovate](https://github.com/marketplace/renovate) for your project.

## Database utils

Generate migration

```bash
npm run migration:generate -- src/database/migrations/CreateNameTable
```

Run migration

```bash
npm run migration:run
```

Revert migration

```bash
npm run migration:revert
```

Drop all tables in database

```bash
npm run schema:drop
```

Run seed

```bash
npm run seed:run
```

## Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e
```

## Tests in Docker

```bash
docker compose -f docker-compose.ci.yaml --env-file env-example -p ci up --build --exit-code-from api && docker compose -p ci rm -svf
```

## Test benchmarking

```bash
docker run --rm jordi/ab -n 100 -c 100 -T application/json -H "Authorization: Bearer USER_TOKEN" -v 2 http://<server_ip>:3000/api/v1/users
```

# Convention to follow

## Coding convention

Every entities are placed in `modules` folder and should follow the following structure (Example for `users` entity) :

```
--> modules
    |--> users
        --> dto(s)
        --> entities
        --> guards
        --> interfaces
        --> docs(if present)
        --> serializations (if present)
        users.controller.ts
        users.service.ts
        users.module.ts
```

Any utilities function should be written in `ultils` folder.

For common interfaces or config, place them to `common`

For working with database migration, seeds, locates to the `database` folder and start to write code within it.

## Git convention:

<i>To protect main source code, please don't directly push your code to `master` branch.</i>

There are two branches: `master` branch and `development` branch

- The `master` branch stores the production code.
- The `development` one contains the code that is in development.

We are developers, so we should use `development` branch and left `master` for leader BaoLe

### For developement phase

- Name your branch to : dev/[yourname]/[prefix]
- You can use some suggested `prefix`s:
  - `feature`
  - `fix`
  - `hotfix`

For example:

- If I am adding some feature to our source code, I can name my branch to: `dev/mndoan/feature` or `dev/mndoan/feature-orm`

### Pushing code to repository also needs to follow some rules

Add your `prefix` before any commiting message along with an optional information such as `add`, `remove`, `fix`... before pushing it to Git.

Example: if I am currently in branch `dev/mndoan/feature` and I have done defining ORM for entities, I would commit with this message:

`git commit -m "feature/add: Define entities interface."`
