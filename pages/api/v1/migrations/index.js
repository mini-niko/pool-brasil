import migrator from "infra/migrator";

const methods = {
  async GET(res) {
    const pendingMigrations = await migrator.listPendingMigrations();

    return res.status(200).json(pendingMigrations);
  },

  async POST(res) {
    const pendingMigrations = await migrator.runPendingMigrations();

    if (pendingMigrations.length === 0)
      return res.status(200).json(pendingMigrations);

    return res.status(201).json(pendingMigrations);
  },
};

async function migrations(req, res) {
  const executeMethod = methods[req.method];

  if (!executeMethod) return res.status(405).end();

  return executeMethod(res);
}

export default migrations;
