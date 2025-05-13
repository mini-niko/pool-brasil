import orchestrator from "test/orchestrator";

let loggedUser;
let sessionToken;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.upMigrations();
  loggedUser = await orchestrator.createUser("admin");
  sessionToken = await orchestrator.setSession(loggedUser);
});

describe("POST to /api/v1/migrations", () => {
  describe("Annonymous user", () => {
    test("Running pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "POST",
      });

      expect(response.status).toBe(401);

      const body = await response.json();

      expect(body.name).toBe("UnauthorizedError");
      expect(body.message).toBe(
        "O usuário não pode executar a operação requisitada.",
      );
      expect(body.action).toBe(
        'Verifique se o usuário possui algumas das seguintes permissões: "admin".',
      );
      expect(body.status_code).toBe(401);
    });
  });
  describe("Admin user", () => {
    test("Running pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "POST",
        headers: {
          Cookie: `sessionToken=${sessionToken}`,
        },
      });

      expect(response.status).toBe(200);

      const body = await response.json();

      expect(Array.isArray(body)).toBe(true);
      expect(body).toHaveLength(0);
    });
  });
});
