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

  const token = authentication.generateToken();

  await redis.set(`session:${token}`, setInRedis);

  return token;
}

async function upMigrations() {
  await migrator.runPendingMigrations();
}

async function createUser(feature) {
  const userWithFeatures = {
    admin: {
      name: "Alice Mendes",
      cpf: "250.227.740-03",
      email: "alice.mendes@example.com",
      password: "senhaForte123",
      confirm_password: "senhaForte123",
      birth_day: new Date("1992-03-14"),
      features: ["admin"],
      address: {
        state: "SP",
        city: "São Paulo",
        street: "Rua das Flores",
        number: 123,
        complement: "Bloco A",
        reference: "Próximo à padaria Bela Vista",
      },
    },
    professional: {
      name: "Bruno Oliveira",
      cpf: "310.855.850-18",
      email: "bruno.oliveira@example.com",
      password: "minhaSenha456",
      confirm_password: "minhaSenha456",
      birth_day: new Date("1987-11-09"),
      features: ["professional"],
      address: {
        state: "RJ",
        city: "Rio de Janeiro",
        street: "Avenida Atlântica",
        number: 456,
        complement: "Cobertura",
        reference: "Em frente à praia",
      },
    },
    client: {
      name: "Carla Souza",
      cpf: "798.942.140-29",
      email: "carla.souza@example.com",
      password: "carlaSenha789",
      confirm_password: "carlaSenha789",
      birth_day: new Date("1995-07-21"),
      features: ["client"],
      address: {
        state: "MG",
        city: "Belo Horizonte",
        street: "Rua do Comércio",
        number: 789,
        complement: "Sala 12",
        reference: "Ao lado do Banco XYZ",
      },
    },
  };

  const userResponse = await users.createUser(userWithFeatures[feature]);

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
  createUser,
  parseCookiesFromResponse,
  createConfirmToken,
};

export default orchestrator;
