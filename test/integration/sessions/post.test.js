import redis from "infra/redis";
import orchestrator from "test/orchestrator.js";

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

  await orchestrator.cleanRedis();
});

describe("POST to /api/v1/sessions", () => {
  describe("Annonymous User", () => {
    describe("Perform a login", () => {
      test("Valid login", async () => {
        const response = await fetch("http://localhost:3000/api/v1/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: mockUser.email,
            password: mockUser.password,
          }),
        });

        expect(response.status).toBe(201);

        const body = await response.json();
        const responseToken = body.token;

        console.log(responseToken);

        expect(typeof responseToken).toBe("string");
        expect(responseToken.length).toBe(32);

        const query = await redis.search(`session:${responseToken}`);
        const userSession = JSON.parse(query);

        expect(userSession.id).toBe(mockUser.id);
        expect(userSession.name).toBe(mockUser.name);
        expect(userSession.features).toEqual(mockUser.features);

        const sessionCookie = orchestrator.parseCookiesFromResponse(response);

        expect(sessionCookie.name).toBe("sessionToken");
        expect(sessionCookie.value).toBe(responseToken);
        expect(sessionCookie.httpOnly).toBeTruthy();
        expect(sessionCookie.maxAge).toBe(parseInt(process.env.SESSION_TIME));
        expect(sessionCookie.secure).toBeTruthy();
      });

      test("Invalid login", async () => {
        const responseWithWrongEmail = await fetch(
          "http://localhost:3000/api/v1/sessions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: "invalid_mail@email.com",
              password: mockUser.password,
            }),
          },
        );

        const bodyWithWrongEmail = await responseWithWrongEmail.json();

        const responseWithWrongPassword = await fetch(
          "http://localhost:3000/api/v1/sessions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: mockUser.email,
              password: "invalid_password",
            }),
          },
        );

        const bodyWithWrongPassword = await responseWithWrongPassword.json();

        expect(bodyWithWrongEmail).toEqual(bodyWithWrongPassword);
        expect(bodyWithWrongEmail.name).toBe("UnauthorizedError");
        expect(bodyWithWrongEmail.message).toBe(
          "The email and/or password don't match any account.",
        );
        expect(bodyWithWrongEmail.action).toBe(
          "Send an email and password valid.",
        );
        expect(bodyWithWrongEmail.status_code).toBe(401);
      });
    });
  });
});
