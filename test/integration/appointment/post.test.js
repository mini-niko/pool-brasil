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
});

describe("POST to /api/v1/appointment", () => {
  describe("Annonymous User", () => {
    test("Create new appointment", async () => {
      const response = await fetch("http://localhost:3000/api/v1/appointment", {
        method: "POST",
      });

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
    describe("Create new appointment", () => {
      describe("Valid data", () => {
        test("With all fields", async () => {
          const appointment = {
            client_id: clientUser.id,
            professional_id: professionalUser.id,
            date_time: new Date("2030-01-02T04:15:00"),
            service_id: 1,
            location: {
              state: "SC",
              city: "XANXERÊ",
              street: "Rua XXX",
              number: 2,
              complement: "Apartamento 1",
              reference: "Árvores",
              latitude: -24.123456,
              longitude: -24.123456,
            },
          };

          const response = await fetch(
            "http://localhost:3000/api/v1/appointment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: `sessionToken=${sessionToken}`,
              },
              body: JSON.stringify(appointment),
            },
          );

          expect(response.status).toBe(201);

          const body = await response.json();

          expect(body.id).toEqual(1);
          expect(body.client_id).toEqual(clientUser.id);
          expect(body.professional_id).toEqual(professionalUser.id);
          expect(body.date_time).toEqual("2030-01-02T07:15:00.000Z");
          expect(body.status).toEqual("pending");
          expect(body.appointment_location_id).toEqual(1);
          expect(body.location).toEqual(appointment.location);
        });
        test("Without complement", async () => {
          const appointment = {
            client_id: clientUser.id,
            professional_id: professionalUser.id,
            date_time: new Date("2030-01-02T04:15:00"),
            service_id: 1,
            location: {
              state: "SC",
              city: "XANXERÊ",
              street: "Rua XXX",
              number: 2,
              reference: "Árvores",
              latitude: -24.123456,
              longitude: -24.123456,
            },
          };

          const response = await fetch(
            "http://localhost:3000/api/v1/appointment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: `sessionToken=${sessionToken}`,
              },
              body: JSON.stringify(appointment),
            },
          );

          expect(response.status).toBe(201);

          const body = await response.json();

          expect(body.id).toEqual(2);
          expect(body.client_id).toEqual(clientUser.id);
          expect(body.professional_id).toEqual(professionalUser.id);
          expect(body.date_time).toEqual("2030-01-02T07:15:00.000Z");
          expect(body.status).toEqual("pending");
          expect(body.appointment_location_id).toEqual(2);
          expect(body.location).toEqual({
            ...appointment.location,
            complement: "",
          });
        });
        test("Without reference", async () => {
          const appointment = {
            client_id: clientUser.id,
            professional_id: professionalUser.id,
            date_time: new Date("2030-01-02T04:15:00"),
            service_id: 1,
            location: {
              state: "SC",
              city: "XANXERÊ",
              street: "Rua XXX",
              number: 2,
              complement: "Apartamento 01",
              latitude: -24.123456,
              longitude: -24.123456,
            },
          };

          const response = await fetch(
            "http://localhost:3000/api/v1/appointment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: `sessionToken=${sessionToken}`,
              },
              body: JSON.stringify(appointment),
            },
          );

          expect(response.status).toBe(201);

          const body = await response.json();

          expect(body.id).toEqual(3);
          expect(body.client_id).toEqual(clientUser.id);
          expect(body.professional_id).toEqual(professionalUser.id);
          expect(body.date_time).toEqual("2030-01-02T07:15:00.000Z");
          expect(body.status).toEqual("pending");
          expect(body.appointment_location_id).toEqual(3);
          expect(body.location).toEqual({
            ...appointment.location,
            reference: "",
          });
        });
      });
      describe("Invalid data", () => {
        test("Without user id", async () => {
          const appointment = {
            professional_id: professionalUser.id,
            date_time: new Date("2030-01-02T04:15:00"),
            service_id: 1,
            location: {
              state: "SC",
              city: "XANXERÊ",
              street: "Rua XXX",
              number: "2",
              complement: "Apartamento 1",
              reference: "Árvores",
              latitude: -24.123456,
              longitude: -24.123456,
            },
          };

          const response = await fetch(
            "http://localhost:3000/api/v1/appointment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: `sessionToken=${sessionToken}`,
              },
              body: JSON.stringify(appointment),
            },
          );

          expect(response.status).toBe(400);

          const body = await response.json();

          expect(body.name).toBe("ValidationError");
          expect(body.message).toBe('"client_id" is required');
          expect(body.action).toBe("Try adjust your data and try again");
          expect(body.status_code).toBe(400);
        });
        test("Without professional id", async () => {
          const appointment = {
            client_id: clientUser.id,
            date_time: new Date("2030-01-02T04:15:00"),
            service_id: 1,
            location: {
              state: "SC",
              city: "XANXERÊ",
              street: "Rua XXX",
              number: "2",
              complement: "Apartamento 1",
              reference: "Árvores",
              latitude: -24.123456,
              longitude: -24.123456,
            },
          };

          const response = await fetch(
            "http://localhost:3000/api/v1/appointment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: `sessionToken=${sessionToken}`,
              },
              body: JSON.stringify(appointment),
            },
          );

          expect(response.status).toBe(400);

          const body = await response.json();

          expect(body.name).toBe("ValidationError");
          expect(body.message).toBe('"professional_id" is required');
          expect(body.action).toBe("Try adjust your data and try again");
          expect(body.status_code).toBe(400);
        });
        test("Without service id", async () => {
          const appointment = {
            client_id: clientUser.id,
            professional_id: professionalUser.id,
            date_time: new Date("2030-01-02T04:15:00"),
            location: {
              state: "SC",
              city: "XANXERÊ",
              street: "Rua XXX",
              number: "2",
              complement: "Apartamento 1",
              reference: "Árvores",
              latitude: -24.123456,
              longitude: -24.123456,
            },
          };

          const response = await fetch(
            "http://localhost:3000/api/v1/appointment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: `sessionToken=${sessionToken}`,
              },
              body: JSON.stringify(appointment),
            },
          );

          expect(response.status).toBe(400);

          const body = await response.json();

          expect(body.name).toBe("ValidationError");
          expect(body.message).toBe('"service_id" is required');
          expect(body.action).toBe("Try adjust your data and try again");
          expect(body.status_code).toBe(400);
        });
        test("Without date", async () => {
          const appointment = {
            client_id: clientUser.id,
            professional_id: professionalUser.id,
            service_id: 1,
            location: {
              state: "SC",
              city: "XANXERÊ",
              street: "Rua XXX",
              number: "2",
              complement: "Apartamento 1",
              reference: "Árvores",
              latitude: -24.123456,
              longitude: -24.123456,
            },
          };

          const response = await fetch(
            "http://localhost:3000/api/v1/appointment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: `sessionToken=${sessionToken}`,
              },
              body: JSON.stringify(appointment),
            },
          );

          expect(response.status).toBe(400);

          const body = await response.json();

          expect(body.name).toBe("ValidationError");
          expect(body.message).toBe('"date_time" is required');
          expect(body.action).toBe("Try adjust your data and try again");
          expect(body.status_code).toBe(400);
        });
        test("Without location", async () => {
          const appointment = {
            client_id: clientUser.id,
            professional_id: professionalUser.id,
            date_time: new Date("2030-01-02T04:15:00"),
            service_id: 1,
          };

          const response = await fetch(
            "http://localhost:3000/api/v1/appointment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: `sessionToken=${sessionToken}`,
              },
              body: JSON.stringify(appointment),
            },
          );

          expect(response.status).toBe(400);

          const body = await response.json();

          expect(body.name).toBe("ValidationError");
          expect(body.message).toBe('"location" is required');
          expect(body.action).toBe("Try adjust your data and try again");
          expect(body.status_code).toBe(400);
        });
        test("Without state", async () => {
          const appointment = {
            client_id: clientUser.id,
            professional_id: professionalUser.id,
            date_time: new Date("2030-01-02T04:15:00"),
            service_id: 1,
            location: {
              city: "XANXERÊ",
              street: "Rua XXX",
              number: "2",
              complement: "Apartamento 1",
              reference: "Árvores",
              latitude: -24.123456,
              longitude: -24.123456,
            },
          };

          const response = await fetch(
            "http://localhost:3000/api/v1/appointment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: `sessionToken=${sessionToken}`,
              },
              body: JSON.stringify(appointment),
            },
          );

          expect(response.status).toBe(400);

          const body = await response.json();

          expect(body.name).toBe("ValidationError");
          expect(body.message).toBe('"location.state" is required');
          expect(body.action).toBe("Try adjust your data and try again");
          expect(body.status_code).toBe(400);
        });
        test("Without city", async () => {
          const appointment = {
            client_id: clientUser.id,
            professional_id: professionalUser.id,
            date_time: new Date("2030-01-02T04:15:00"),
            service_id: 1,
            location: {
              state: "SC",
              street: "Rua XXX",
              number: "2",
              complement: "Apartamento 1",
              reference: "Árvores",
              latitude: -24.123456,
              longitude: -24.123456,
            },
          };

          const response = await fetch(
            "http://localhost:3000/api/v1/appointment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: `sessionToken=${sessionToken}`,
              },
              body: JSON.stringify(appointment),
            },
          );

          expect(response.status).toBe(400);

          const body = await response.json();

          expect(body.name).toBe("ValidationError");
          expect(body.message).toBe('"location.city" is required');
          expect(body.action).toBe("Try adjust your data and try again");
          expect(body.status_code).toBe(400);
        });
        test("Without number", async () => {
          const appointment = {
            client_id: clientUser.id,
            professional_id: professionalUser.id,
            date_time: new Date("2030-01-02T04:15:00"),
            service_id: 1,
            location: {
              state: "SC",
              city: "XANXERÊ",
              street: "Rua XXX",
              complement: "Apartamento 1",
              reference: "Árvores",
              latitude: -24.123456,
              longitude: -24.123456,
            },
          };

          const response = await fetch(
            "http://localhost:3000/api/v1/appointment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: `sessionToken=${sessionToken}`,
              },
              body: JSON.stringify(appointment),
            },
          );

          expect(response.status).toBe(400);

          const body = await response.json();

          expect(body.name).toBe("ValidationError");
          expect(body.message).toBe('"location.number" is required');
          expect(body.action).toBe("Try adjust your data and try again");
          expect(body.status_code).toBe(400);
        });
        test("Without latitude", async () => {
          const appointment = {
            client_id: clientUser.id,
            professional_id: professionalUser.id,
            date_time: new Date("2030-01-02T04:15:00"),
            service_id: 1,
            location: {
              state: "SC",
              city: "XANXERÊ",
              street: "Rua XXX",
              number: "2",
              complement: "Apartamento 1",
              reference: "Árvores",
              longitude: -24.123456,
            },
          };

          const response = await fetch(
            "http://localhost:3000/api/v1/appointment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: `sessionToken=${sessionToken}`,
              },
              body: JSON.stringify(appointment),
            },
          );

          expect(response.status).toBe(400);

          const body = await response.json();

          expect(body.name).toBe("ValidationError");
          expect(body.message).toBe('"location.latitude" is required');
          expect(body.action).toBe("Try adjust your data and try again");
          expect(body.status_code).toBe(400);
        });
        test("Without longitude", async () => {
          const appointment = {
            client_id: clientUser.id,
            professional_id: professionalUser.id,
            date_time: new Date("2030-01-02T04:15:00"),
            service_id: 1,
            location: {
              state: "SC",
              city: "XANXERÊ",
              street: "Rua XXX",
              number: "2",
              complement: "Apartamento 1",
              reference: "Árvores",
              latitude: -24.123456,
            },
          };

          const response = await fetch(
            "http://localhost:3000/api/v1/appointment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: `sessionToken=${sessionToken}`,
              },
              body: JSON.stringify(appointment),
            },
          );

          expect(response.status).toBe(400);

          const body = await response.json();

          expect(body.name).toBe("ValidationError");
          expect(body.message).toBe('"location.longitude" is required');
          expect(body.action).toBe("Try adjust your data and try again");
          expect(body.status_code).toBe(400);
        });
      });
    });
  });
});
