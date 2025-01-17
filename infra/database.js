import { InternalServerError } from "errors";
import { Client } from "pg";

async function getNewClient() {
  const pgClient = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: getSSL(),
  });

  pgClient.connect();
  return pgClient;
}

async function query(query, params = []) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(query, params);
    return result;
  } catch (err) {
    throw new InternalServerError({
      message: err.message,
      stack: new Error().stack,
    });
  } finally {
    await client.end();
  }
}

function getSSL() {
  if (process.env.POSTGRES_CA)
    return {
      ca: process.env.POSTGRES_CA,
    };

  return process.env.NODE_ENV === "production";
}

async function status() {
  const openConnectionsQuery = await database.query(
    "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    [process.env.POSTGRES_DB],
  );
  const openConnections = openConnectionsQuery.rows[0].count;

  const maxConnectionsQuery = await database.query("SHOW max_connections;");
  const maxConnections = maxConnectionsQuery.rows[0].max_connections;

  const versionQuery = await database.query("SHOW server_version;");
  const version = versionQuery.rows[0].server_version;

  return {
    status: "healthy",
    open_connections: openConnections,
    max_connections: parseInt(maxConnections),
    version,
  };
}

const database = {
  getNewClient,
  query,
  status,
};

export default database;
