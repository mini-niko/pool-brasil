import migrator from "infra/migrator";
import router from "infra/router";

const migrationsRouter = router.get(getHandler).post(postHandler);

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

export default migrationsRouter.handler();
