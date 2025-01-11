import database from "infra/database.js";

async function status(req, res) {
  const currentTime = new Date().toISOString();

  const openConnectionsQuery = await database.query(
    "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    [process.env.POSTGRES_DB],
  );
  const openConnections = openConnectionsQuery.rows[0].count;

  const maxConnectionsQuery = await database.query("SHOW max_connections;");
  const maxConnections = maxConnectionsQuery.rows[0].max_connections;

  const versionQuery = await database.query("SHOW server_version;");
  const version = versionQuery.rows[0].server_version;

  const databaseResponse = {
    status: "healthy",
    open_connections: openConnections,
    max_connections: parseInt(maxConnections),
    version,
  };

  const responseBody = {
    current_time: currentTime,
    database: databaseResponse,
  };

  res.status(200).json(responseBody);
}

export default status;
