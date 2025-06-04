import orchestrator from "test/orchestrator.js";

let mockUser;

let sessionToken;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.upMigrations();
  mockUser = await orchestrator.createUser("client");

  await orchestrator.cleanRedis();
  sessionToken = await orchestrator.setSession(mockUser);
});

describe("GET to /api/v1/sessions", () => {
  describe("Logged User", () => {
    describe("Get credentials", () => {
      test("Without credentials", async () => {
        const response = await fetch(`http://localhost:3000/api/v1/sessions`);

        expect(response.status).toBe(404);

        const body = await response.json();

        expect(body.name).toBe("NotFoundError");
        expect(body.message).toBe("Not found an user with this session token.");
        expect(body.action).toBe(
          "Send an valid session token or create a new session.",
        );
        expect(body.status_code).toBe(404);
      });

      describe("With Valid Token", () => {
        test("Send in cookies", async () => {
          const response = await fetch(
            `http://localhost:3000/api/v1/sessions`,
            {
              headers: {
                Cookie: `sessionToken=${sessionToken}`,
              },
            },
          );

          expect(response.status).toBe(200);

          const user = await response.json();

          expect(user).not.toBeFalsy();
          expect(user.id).toBe(mockUser.id);
          expect(user.name).toBe(mockUser.name);
          expect(user.features).toEqual(mockUser.features);
        });
      });

      describe("With Invalid Token", () => {
        test("Send in cookies", async () => {
          const invalidToken = "123123123123";
          const response = await fetch(
            `http://localhost:3000/api/v1/sessions`,
            {
              headers: {
                Cookie: `sessionToken=${invalidToken}`,
              },
            },
          );

          expect(response.status).toBe(404);

          const body = await response.json();

          expect(body.name).toBe("NotFoundError");
          expect(body.message).toBe(
            "Not found an user with this session token.",
          );
          expect(body.action).toBe(
            "Send an valid session token or create a new session.",
          );
          expect(body.status_code).toBe(404);
        });
      });
    });
  });
});
