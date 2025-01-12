import orchestrator from "test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  expect(response.status).toBe(200);

  const body = await response.json();
  const currentTime = body.current_time;

  const timeISO = new Date(currentTime).toISOString();

  expect(currentTime).toBe(timeISO);

  const database = body.database;

  expect(database.status).toBe("healthy");
  expect(database.open_connections).toBe(1);
  expect(database.max_connections).toBe(100);
  expect(database.version).toBe("16.0");
});
