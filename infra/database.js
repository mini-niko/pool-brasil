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
    console.log(err);
    throw err;
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

const database = {
  getNewClient,
  query,
};

export default database;
