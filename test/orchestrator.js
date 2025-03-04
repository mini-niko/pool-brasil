import retry from "async-retry";
import database from "infra/database";
import migrator from "infra/migrator";
import redis from "infra/redis";
import users from "models/users";
import { parseSetCookie } from "next/dist/compiled/@edge-runtime/cookies";

async function waitForAllServices() {
  await waitForWebServices();

  async function waitForWebServices() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) {
        throw new Error();
      }
    }
  }
}

async function cleanDatabase() {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

async function cleanRedis() {
  await redis.flush();
}

async function upMigrations() {
  await migrator.runPendingMigrations();
}

async function setMockUser(user) {
  return await users.createUser(user);
}

function parseCookiesFromResponse(response) {
  const setCookie = response.headers.get("set-cookie");

  return parseSetCookie(setCookie);
}

const orchestrator = {
  waitForAllServices,
  cleanDatabase,
  cleanRedis,
  upMigrations,
  setMockUser,
  parseCookiesFromResponse,
};

export default orchestrator;
