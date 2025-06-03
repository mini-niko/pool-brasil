import orchestrator from "test/orchestrator";

let clientUser;
let professionalUser;
let sessionToken;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.upMigrations();
  clientUser = await orchestrator.createUser("client");
  professionalUser = await orchestrator.createUser("professional");
  sessionToken = await orchestrator.setSession(clientUser);

  await orchestrator.createAppointment(
    clientUser.id,
    professionalUser.id,
    14.5,
  );
  await orchestrator.createAppointment(
    clientUser.id,
    professionalUser.id,
    15.75,
  );
});

describe("POST to /api/v1/appointment", () => {
  describe("Annonymous User", () => {
    test("Create new appointment", async () => {
      const response = await fetch("http://localhost:3000/api/v1/appointment");

      expect(response.status).toBe(401);

      const body = await response.json();

      expect(body).toEqual({
        name: "UnauthorizedError",
        message: "O usuário não pode executar a operação requisitada.",
        action:
          'Verifique se o usuário possui algumas das seguintes permissões: "client", "professional".',
        status_code: 401,
      });
    });
  });
  describe("Client User", () => {
    test("Create new appointment", async () => {
      const response = await fetch("http://localhost:3000/api/v1/appointment", {
        headers: {
          Cookie: `sessionToken=${sessionToken}`,
        },
      });

      expect(response.status).toBe(200);

      // const body = await response.json();
    });
  });
});
