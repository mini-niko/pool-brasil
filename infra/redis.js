import { createClient } from "redis";

async function getClient() {
  let client;

  if (process.env.REDIS_USERNAME) {
    client = await createClient({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    });
  } else {
    client = await createClient();
  }

  await client.connect();
  return client;
}

async function set(key, value, expiresAt) {
  const client = await getClient();

  const query = expiresAt
    ? await client.set(key, value, { EX: expiresAt })
    : await client.set(key, value);

  await client.quit();

  return query;
}

async function search(key) {
  const client = await getClient();

  const query = await client.get(key);

  await client.quit();

  return query;
}

async function flush() {
  const client = await getClient();
  await client.flushAll();
  await client.quit();
}

const redis = {
  search,
  set,
  flush,
};

export default redis;
