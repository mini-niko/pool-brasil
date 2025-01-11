import database from "infra/database.js";

beforeAll(async () => {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
});

test("GET to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");

  expect(response.status).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);

  const migration = body[0];

  expect(migration.path).not.toBeUndefined();
  expect(migration.name).not.toBeUndefined();
  expect(migration.timestamp).not.toBeUndefined();

  expect(migration.name.startsWith(migration.timestamp)).toBe(true);

  const time = new Date(migration.timestamp).getTime();

  expect(migration.timestamp).toBe(time);
});
