import orchestrator from "test/orchestrator";

let mockUser;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.upMigrations();
  mockUser = await orchestrator.createUser("client");
});

describe("GET to /api/v1/user", () => {
  describe("Annonymous User", () => {
    describe("Retrieving an user", () => {
      test("With valid ID", async () => {
        const response = await fetch(
          `http://localhost:3000/api/v1/user?id=${mockUser.id}`,
        );

        expect(response.status).toBe(200);

        const body = await response.json();

        expect(body).toEqual(mockUser);
      });
      test("With non-existent ID", async () => {
        const invalidId = "440e4e6b-0c5b-418e-985e-4c05e4e719cf";

        const response = await fetch(
          `http://localhost:3000/api/v1/user?id=${invalidId}`,
        );

        expect(response.status).toBe(404);
      });
      test("With invalid ID", async () => {
        const invalidId = "invalid-id";

        const response = await fetch(
          `http://localhost:3000/api/v1/user?id=${invalidId}`,
        );

        expect(response.status).toBe(400);

        const body = await response.json();

        expect(body).toEqual({
          name: "ValidationError",
          message: '"id" must be and uuid id.',
          action: "Try send an valid id.",
          status_code: 400,
        });
      });
    });
  });
});
