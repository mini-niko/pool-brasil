import retry from "async-retry";
import database from "infra/database";
import migrator from "infra/migrator";
import redis from "infra/redis";
import authentication from "models/authentication.js";
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
      const response = await fetch(`${process.env.SERVER_URL}/api/v1/status`);

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

async function setSession(user) {
  const setInRedis = JSON.stringify({
    id: user.id,
    name: user.name,
    features: user.features,
  });

  const token = "123456789";

  await redis.set(`session:${token}`, setInRedis);

  return token;
}

async function upMigrations() {
  await migrator.runPendingMigrations();
}

async function setMockUser(user) {
  const userResponse = await users.createUser(user);

  userResponse.created_at = userResponse.created_at.toISOString();
  userResponse.updated_at = userResponse.updated_at.toISOString();
  userResponse.birth_day = userResponse.birth_day.toISOString();

  return userResponse;
}

function parseCookiesFromResponse(response) {
  const setCookie = response.headers.get("set-cookie");

  return parseSetCookie(setCookie);
}

async function createConfirmToken(userId) {
  return await authentication.saveValueWithToken("confirmation", userId);
}

const orchestrator = {
  waitForAllServices,
  cleanDatabase,
  cleanRedis,
  setSession,
  upMigrations,
  setMockUser,
  parseCookiesFromResponse,
  createConfirmToken,
};

export default orchestrator;
