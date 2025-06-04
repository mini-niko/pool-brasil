import userValidate from "@/models/validation/user";
import orchestrator from "test/orchestrator";

let sessionToken;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.upMigrations();
  const mockUser = await orchestrator.createUser("admin");
  sessionToken = await orchestrator.setSession(mockUser);
});

describe("GET to /api/v1/users", () => {
  describe("Annonymous User", () => {
    describe("Retrieving all users", () => {
      test("With valid ID", async () => {
        const response = await fetch(`http://localhost:3000/api/v1/users`, {
          headers: {
            Cookie: `sessionToken=${sessionToken}`,
          },
        });

        expect(response.status).toBe(200);

        const body = await response.json();

        expect(Array.isArray(body)).toBeTruthy();
        expect(body).toHaveLength(1);

        const user = body[0];

        const userValidationError =
          userValidate.publicUserSchema.validate(user).error?.details[0];

        expect(userValidationError).toBeUndefined();
      });
    });
  });
});
