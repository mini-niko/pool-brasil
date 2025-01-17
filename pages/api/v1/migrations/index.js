import migrator from "infra/migrator";
import { createRouter } from "next-connect";

export default createRouter().get(getHandler).post(postHandler).handler();

async function getHandler(req, res) {
  const pendingMigrations = await migrator.listPendingMigrations();

  return res.status(200).json(pendingMigrations);
}

async function postHandler(req, res) {
  const pendingMigrations = await migrator.runPendingMigrations();

  if (pendingMigrations.length === 0)
    return res.status(200).json(pendingMigrations);

  return res.status(201).json(pendingMigrations);
}
