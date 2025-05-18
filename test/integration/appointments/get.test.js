import orchestrator from "test/orchestrator";

let clientUser;
let professionalUser;
let clientSessionToken;
let professionalSessionToken;

const appointments = [];

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.upMigrations();

  clientUser = await orchestrator.createUser("client");
  professionalUser = await orchestrator.createUser("professional");
  clientSessionToken = await orchestrator.setSession(clientUser);
  professionalSessionToken = await orchestrator.setSession(professionalUser);

  const firstAppointment = await orchestrator.createAppointment(
    clientUser.id,
    professionalUser.id,
    13.5,
  );

  const secondAppointment = await orchestrator.createAppointment(
    clientUser.id,
    professionalUser.id,
    15.5,
  );

  appointments.push(firstAppointment, secondAppointment);
});

describe("GET to /api/v1/appointments", () => {
  describe("Annonymous User", () => {
    test("Get an appointment", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/appointments/professional/avaliable-time",
      );

      expect(response.status).toBe(401);

      const body = await response.json();

      expect(body.name).toBe("UnauthorizedError");
      expect(body.message).toBe(
        "O usuário não pode executar a operação requisitada.",
      );
      expect(body.action).toBe(
        'Verifique se o usuário possui algumas das seguintes permissões: "client", "professional".',
      );
      expect(body.status_code).toBe(401);
    });
  });
  describe("Client User", () => {
    test("Get an avaliable hour of an professional", async () => {
      const date = appointments[0].date_time.toLocaleDateString("en-CA");

      const response = await fetch(
        `http://localhost:3000/api/v1/appointments/professional/avaliable-time?id=${professionalUser.id}&date=${date}`,
        {
          headers: {
            Cookie: `sessionToken=${clientSessionToken}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const body = await response.json();

      expect(Array.isArray(body)).toBeTruthy();
      expect(body.length).toBe(11);
      expect(body).toEqual([
        "14:30",
        "14:45",
        "15:00",
        "15:15",
        "16:30",
        "16:45",
        "17:00",
        "17:15",
        "17:30",
        "17:45",
        "18:00",
      ]);
    });
  });
});
