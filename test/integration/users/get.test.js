import orchestrator from "test/orchestrator";

let mockUser = {
  name: "Mock User",
  cpf: "35638417052",
  email: "example@mail.com",
  password: "12345678",
  confirm_password: "12345678",
  birth_day: new Date("01/01/2000"),
  address: {
    state: "SC",
    city: "Xanxerê",
    street: "Avenida Brasil",
    number: 1,
    complement: "apto 4",
    reference: "Ao lado do mercado XXX",
  },
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

        expect(body).toEqual(mockUser);
      });
      test("With non-existent ID", async () => {
        const invalidId = "440e4e6b-0c5b-418e-985e-4c05e4e719cf";

        const response = await fetch(
          `http://localhost:3000/api/v1/users?id=${invalidId}`,
        );

        expect(response.status).toBe(404);
      });
      test("With invalid ID", async () => {
        const invalidId = "invalid-id";

        const response = await fetch(
          `http://localhost:3000/api/v1/users?id=${invalidId}`,
        );

        expect(response.status).toBe(400);

        const body = await response.json();

        expect(body).toEqual({
          name: "ValidationError",
          message: '"id" must be and uuid id.',
          action: "Try send an valid id",
          status_code: 400,
        });
      });
    });
  });
});
