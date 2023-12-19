## Telegram-GPT

A Telegram Bot named Samantha, inspired by the film "Her" that leverages Chat-GPT features with OpenAI.

### Getting Started

1. Install dependencies:

   Make sure you have [pnpm](https://pnpm.io/) installed. [Learn more](https://pnpm.io/installation) about installing pnpm.

   ```bash
   pnpm install
   ```

2. Run the database

   Since this project uses Prisma ORM. The Postgres database container needs to be running upon the project init to avoid any Prisma connection error.

   ```bash
   pnpm db:up
   ```

   To learn more about running databases using Docker. Checkout the [Prisma](#prisma) section.

3. Run the app in dev mode

   ```bash
   pnpm start:dev
   ```

### Commands

- `reset` - To reset your character and bot chat history
- `start` - To initialize your bot
- `model` - To show the list of available models and select your model.
- `voice` - To show the list of available speakers.
- `character` - To enter your bot character prompt and select predefined character. To enter custom character prompt, use: e.g. `/character i am an assistant`

### Docker

You can run this project without having Node.js installed on your machine by running it using Docker as a container. You can learn more about Docker [here](https://docs.docker.com/get-started/).

Make sure Docker is installed and Docker daemon is running on your machine. You can learn more how to download and setup Docker [here](https://www.docker.com/products/docker-desktop/).

1. Run the Docker containers using Docker Compose

   ```bash
   docker compose up -d --build
   ```

2. Stop running containers

   ```bash
   docker compose down
   ```

You can also run these commands with `make` command based on this project's [Makefile](./Makefile) configuration to avoid memorizing the long `docker` commands.

1. Run containers

   ```bash
   make docker-run
   ```

2. Stop container

   ```bash
   make docker-stop
   ```

### Prisma

This NestJS starter template comes with Prisma ORM, a modern Node.js and TypeScript ORM that works really well with NestJS. You can check the full official guide to get started with NestJS and Prisma [here](https://www.prisma.io/nestjs).

1. Running the database

   It only runs Postgres container with Docker Compose

   ```bash
   pnpm db:up
   ```

2. Create a database migration

   Whenever you make any changes in the `schema.prisma` file, you need to create a migration to reflect the changes you made on the schema to the database.

   To create a migration, simply run this command, then enter the name of the migration. e.g. `add_user_table`

   ```bash
   pnpm prisma migrate dev
   ```

3. Run existing migrations

   ```bash
   pnpm db:deploy
   ```

4. Generate Prisma Client

   It runs the `prisma generate` command under the hood to generate type definitions based on the `schema.prisma` schema.

   ```bash
   pnpm db:generate
   ```

5. Run Prisma Studio

   It runs the [Prisma Studio](https://www.prisma.io/studio) tools to open Prisma database admin client tools.

   ```bash
   pnpm db:studio
   ```

### Unit Testing

This starter template has Jest setup to run unit and integration API tests. Tests are automatically executed on every pull request and push by GitHub Actions CI workflow.

You can run unit tests and e2e tests manually on your machine:

- Run all unit tests
  ```bash
  pnpm test
  ```
- Run test in watch mode
  ```bash
  pnpm test:watch
  ```
- Unit test coverage
  ```bash
  pnpm test:cov
  ```
