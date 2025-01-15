import orchestrator from "test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.upMigrations(() => {});
});

describe("POST to /api/v1/users", () => {
  describe("Annonymous user", () => {
    describe("Create an user", () => {
      test("Valid", async () => {
        const user = {
          name: "Test",
          cpf: "01234567890",
          email: "example@test.com",
          password: "12345678",
          birth_day: new Date("11/17/2005"),
        };

        const response = await fetch("http://localhost:3000/api/v1/users", {
          method: "POST",
          body: JSON.stringify(user),
        });

        expect(response.status).toBe(201);

        const body = await response.json();

        expect(body.id.length).toBe(36);
        expect(body.name).toBe(user.name);
        expect(body.cpf).toBe(user.cpf);
        expect(body.email).toBe(user.email);
        expect(body.password).toBe(user.password);

        const createdAtISO = new Date(body.created_at).toISOString();
        const updatedAtISO = new Date(body.updated_at).toISOString();

        expect(body.birth_day).toBe(user.birth_day.toISOString());
        expect(body.created_at).toBe(createdAtISO);
        expect(body.updated_at).toBe(updatedAtISO);
      });
    });
  });
});
