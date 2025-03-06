import { createClient } from "redis";

async function getClient() {
  const client = createClient();

  await client.connect();
  return client;
}

async function set(key, value, expiresAt) {
  const client = await getClient();

  const query = expiresAt
    ? await client.set(key, value, { EX: expiresAt })
    : await client.set(key, value);

  return query;
}

async function search(key) {
  const client = await getClient();

  const query = await client.get(key);

  return query;
}

async function flush() {
  const client = await getClient();
  await client.flushAll();
}

const redis = {
  search,
  set,
  flush,
};

export default redis;
