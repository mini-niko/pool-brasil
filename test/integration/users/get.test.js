import orchestrator from "test/orchestrator";

let mockUser = {
  name: "Mock User",
  cpf: "35638417052",
  email: "example@mail.com",
  password: "12345678",
  confirm_password: "12345678",
  birth_day: new Date("01/01/2000"),
};

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.upMigrations();
  mockUser = await orchestrator.setMockUser(mockUser);

  mockUser.created_at = mockUser.created_at.toISOString();
  mockUser.updated_at = mockUser.updated_at.toISOString();
  mockUser.birth_day = mockUser.birth_day.toISOString();
});

describe("GET to /api/v1/users", () => {
  describe("Annonymous User", () => {
    describe("Retrieving an user", () => {
      test("With valid ID", async () => {
        const response = await fetch(
          `http://localhost:3000/api/v1/users?id=${mockUser.id}`,
        );

        expect(response.status).toBe(200);

        const body = await response.json();

        expect(body.name).toBe(mockUser.name);
        expect(body.cpf).toBe(mockUser.cpf);
        expect(body.email).toBe(mockUser.email);
        expect(body.password).toBe(mockUser.password);
        expect(body.confirm_password).toBe(mockUser.confirm_password);
        expect(body.birth_day).toBe(mockUser.birth_day);
      });
    });
  });
});
