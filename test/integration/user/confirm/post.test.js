import users from "models/users";
import orchestrator from "test/orchestrator";

let mockUser;
let token;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.upMigrations();
  mockUser = await orchestrator.createUser(["client"]);
  token = await orchestrator.createConfirmToken(mockUser.id);
});

describe("POST to /api/v1/users", () => {
  describe("Annonymous User", () => {
    describe("Confirm an user", () => {
      test("With valid token", async () => {
        const response = await fetch(
          `http://localhost:3000/api/v1/user/confirm`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
            }),
          },
        );

        expect(response.status).toBe(200);

        const body = await response.json();

        expect(body.user_id).toBe(mockUser.id);

        const searchUser = await users.getUser("id", body.user_id);

        expect(searchUser.features[0]).toBe("client");
      });
      test("With invalid token", async () => {
        const response = await fetch(
          `http://localhost:3000/api/v1/user/confirm`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: "invalid_token",
            }),
          },
        );

        expect(response.status).toBe(404);

        const body = await response.json();

        expect(body.name).toBe("NotFoundError");
        expect(body.message).toBe(
          "There is no pending confirmation with this token.",
        );
        expect(body.action).toBe(
          "Send an valid confirm token or request a new confirmation.",
        );
        expect(body.status_code).toBe(404);
      });
      test("Without token", async () => {
        const response = await fetch(
          `http://localhost:3000/api/v1/user/confirm`,
          {
            method: "POST",
          },
        );

        expect(response.status).toBe(400);

        const body = await response.json();

        expect(body.name).toBe("ValidationError");
        expect(body.message).toBe("'token' cannot be null.");
        expect(body.action).toBe("Send an valid token in request.");
        expect(body.status_code).toBe(400);
      });
    });
  });
});
