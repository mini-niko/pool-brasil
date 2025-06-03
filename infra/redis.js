import { createClient } from "redis";

async function getClient() {
  let client;

  if (process.env.REDIS_URL) {
    client = await createClient({
      url: process.env.REDIS_URL,
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

async function del(key) {
  const client = await getClient();

  const query = await client.del(key);

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
  del,
};

export default redis;
