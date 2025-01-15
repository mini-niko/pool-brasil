import { InternalServerError } from "errors";
import database from "infra/database.js";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

const runnerOptions = {
  dir: join("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  const dbClient = await database.getNewClient();

  try {
    const migrate = await migrationRunner({
      ...runnerOptions,
      dbClient,
      dryRun: true,
    });

    return migrate;
  } catch (err) {
    throw new InternalServerError({});
  } finally {
    await dbClient.end();
  }
}

async function runPendingMigrations() {
  const dbClient = await database.getNewClient();

  try {
    const migrate = await migrationRunner({
      ...runnerOptions,
      dbClient,
      log: () => {},
    });

    return migrate;
  } catch (err) {
    throw new InternalServerError({});
  } finally {
    await dbClient.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
