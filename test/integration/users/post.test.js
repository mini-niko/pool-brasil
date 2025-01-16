import orchestrator from "test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.upMigrations(() => {});
});

describe("POST to /api/v1/users", () => {
  describe("Annonymous user", () => {
    describe("Create an user", () => {
      test("Valid", async () => {
        const user = {
          name: "Test",
          cpf: "07563801030",
          email: "example@test.com",
          password: "12345678",
          confirm_password: "12345678",
          birth_day: new Date("01/01/2000"),
        };

        const response = await fetch("http://localhost:3000/api/v1/users", {
          method: "POST",
          body: JSON.stringify(user),
        });

        expect(response.status).toBe(201);

        const body = await response.json();

        expect(body.id.length).toBe(36);
        expect(body.name).toBe(user.name);
        expect(body.cpf).toBe(user.cpf);
        expect(body.email).toBe(user.email);
        expect(body.password).toBe(user.password);

        const createdAtISO = new Date(body.created_at).toISOString();
        const updatedAtISO = new Date(body.updated_at).toISOString();

        expect(body.birth_day).toBe(user.birth_day.toISOString());
        expect(body.created_at).toBe(createdAtISO);
        expect(body.updated_at).toBe(updatedAtISO);
      });
      describe("Invalid:", () => {
        describe("With existent", () => {
          test("Name", async () => {
            const user = {
              name: "Test",
              cpf: "07563801030",
              email: "example2@test.com",
              password: "12345678",
              confirm_password: "12345678",
              birth_day: new Date("01/01/2000"),
            };

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(user),
            });

            expect(response.status).toBe(409);

            const body = await response.json();

            expect(body.name).toBe("DuplicateError");
            expect(body.message).toBe("This name is already in use");
            expect(body.action).toBe("Try send another name");
            expect(body.status_code).toBe(409);
          });
          test("CPF", async () => {
            const user = {
              name: "Test2",
              cpf: "07563801030",
              email: "example2@test.com",
              password: "12345678",
              confirm_password: "12345678",
              birth_day: new Date("01/01/2000"),
            };

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(user),
            });

            expect(response.status).toBe(409);

            const body = await response.json();

            expect(body.name).toBe("DuplicateError");
            expect(body.message).toBe("This CPF is already in use");
            expect(body.action).toBe("Enter in your account with this CPF");
            expect(body.status_code).toBe(409);
          });
          test("Email", async () => {
            const user = {
              name: "Test2",
              cpf: "06124688018",
              email: "example@test.com",
              password: "12345678",
              confirm_password: "12345678",
              birth_day: new Date("01/01/2000"),
            };

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(user),
            });

            expect(response.status).toBe(409);

            const body = await response.json();

            expect(body.name).toBe("DuplicateError");
            expect(body.message).toBe("This email is already in use");
            expect(body.action).toBe(
              "Enter with you email or send another email",
            );
            expect(body.status_code).toBe(409);
          });
        });
        describe("Without", () => {
          test("Name", async () => {
            const user = {
              cpf: "07563801030",
              email: "email@example.co",
              password: "12345678",
              confirm_password: "12345678",
              birth_day: new Date("01/01/2000"),
            };

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(user),
            });

            expect(response.status).toBe(400);

            const body = await response.json();

            expect(body.name).toBe("ValidationError");
            expect(body.message).toBe('"name" is required');
            expect(body.action).toBe("Try adjust your data and try again");
            expect(body.status_code).toBe(400);
          });
          test("CPF", async () => {
            const user = {
              name: "Teste",
              email: "email@example.co",
              password: "12345678",
              confirm_password: "12345678",
              birth_day: new Date("01/01/2000"),
            };

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(user),
            });

            expect(response.status).toBe(400);

            const body = await response.json();

            expect(body.name).toBe("ValidationError");
            expect(body.message).toBe('"cpf" is required');
            expect(body.action).toBe("Try adjust your data and try again");
            expect(body.status_code).toBe(400);
          });
          test("Email", async () => {
            const user = {
              name: "Teste",
              cpf: "07563801030",
              password: "12345678",
              confirm_password: "12345678",
              birth_day: new Date("01/01/2000"),
            };

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(user),
            });

            expect(response.status).toBe(400);

            const body = await response.json();

            expect(body.name).toBe("ValidationError");
            expect(body.message).toBe('"email" is required');
            expect(body.action).toBe("Try adjust your data and try again");
            expect(body.status_code).toBe(400);
          });
          test("Confirm password", async () => {
            const user = {
              name: "Teste",
              cpf: "07563801030",
              email: "email@example.co",
              password: "12345678",
              birth_day: new Date("01/01/2000"),
            };

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(user),
            });

            expect(response.status).toBe(400);

            const body = await response.json();

            expect(body.name).toBe("ValidationError");
            expect(body.message).toBe('"confirm_password" is required');
            expect(body.action).toBe("Try adjust your data and try again");
            expect(body.status_code).toBe(400);
          });
          test("Password", async () => {
            const user = {
              name: "Teste",
              cpf: "07563801030",
              email: "email@example.co",
              confirm_password: "12345678",
              birth_day: new Date("01/01/2000"),
            };

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(user),
            });

            expect(response.status).toBe(400);

            const body = await response.json();

            expect(body.name).toBe("ValidationError");
            expect(body.message).toBe('"password" is required');
            expect(body.action).toBe("Try adjust your data and try again");
            expect(body.status_code).toBe(400);
          });
          test("Birthday", async () => {
            const user = {
              name: "Teste",
              cpf: "07563801030",
              email: "email@example.co",
              password: "12345678",
              confirm_password: "12345678",
            };

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(user),
            });

            expect(response.status).toBe(400);

            const body = await response.json();

            expect(body.name).toBe("ValidationError");
            expect(body.message).toBe('"birth_day" is required');
            expect(body.action).toBe("Try adjust your data and try again");
            expect(body.status_code).toBe(400);
          });
        });
        describe("Too short", () => {
          test("Name", async () => {
            const user = {
              name: "A",
              cpf: "07563801030",
              email: "email@example.co",
              password: "12345678",
              confirm_password: "12345678",
              birth_day: new Date("01/01/2000"),
            };

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(user),
            });

            expect(response.status).toBe(400);

            const body = await response.json();

            expect(body.name).toBe("ValidationError");
            expect(body.message).toBe(
              '"name" length must be at least 3 characters long',
            );
            expect(body.action).toBe("Try adjust your data and try again");
            expect(body.status_code).toBe(400);
          });
          test("Password", async () => {
            const user = {
              name: "Teste",
              cpf: "07563801030",
              email: "email@example.co",
              password: "1234567",
              confirm_password: "12345678",
              birth_day: new Date("01/01/2000"),
            };

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(user),
            });

            expect(response.status).toBe(400);

            const body = await response.json();

            expect(body.name).toBe("ValidationError");
            expect(body.message).toBe(
              '"password" length must be at least 8 characters long',
            );
            expect(body.action).toBe("Try adjust your data and try again");
            expect(body.status_code).toBe(400);
          });
        });
        describe("Too long", () => {
          test("Name", async () => {
            const user = {
              name: "A".repeat(31),
              cpf: "07563801030",
              email: "email@example.co",
              password: "12345678",
              confirm_password: "12345678",
              birth_day: new Date("01/01/2000"),
            };

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(user),
            });

            expect(response.status).toBe(400);

            const body = await response.json();

            expect(body.name).toBe("ValidationError");
            expect(body.message).toBe(
              '"name" length must be less than or equal to 30 characters long',
            );
            expect(body.action).toBe("Try adjust your data and try again");
            expect(body.status_code).toBe(400);
          });
          test("Password", async () => {
            const user = {
              name: "Teste",
              cpf: "07563801030",
              email: "email@example.co",
              password: "1".repeat(61),
              confirm_password: "1".repeat(61),
              birth_day: new Date("01/01/2000"),
            };

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(user),
            });

            expect(response.status).toBe(400);

            const body = await response.json();

            expect(body.name).toBe("ValidationError");
            expect(body.message).toBe(
              '"password" length must be less than or equal to 60 characters long',
            );
            expect(body.action).toBe("Try adjust your data and try again");
            expect(body.status_code).toBe(400);
          });
        });
        describe("Not valid", () => {
          test("Email", async () => {
            const user = {
              name: "Email",
              cpf: "07563801030",
              email: "email",
              password: "12345678",
              confirm_password: "12345678",
              birth_day: new Date("01/01/2000"),
            };

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(user),
            });

            expect(response.status).toBe(400);

            const body = await response.json();

            expect(body.name).toBe("ValidationError");
            expect(body.message).toBe('"email" must be a valid email');
            expect(body.action).toBe("Try adjust your data and try again");
            expect(body.status_code).toBe(400);
          });
          test("CPF", async () => {
            const user = {
              name: "Email",
              cpf: "00000000000",
              email: "email@example.com",
              password: "12345678",
              confirm_password: "12345678",
              birth_day: new Date("01/01/2000"),
            };

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(user),
            });

            expect(response.status).toBe(400);

            const body = await response.json();

            expect(body.name).toBe("ValidationError");
            expect(body.message).toBe('"cpf" contains an invalid value');
            expect(body.action).toBe("Try adjust your data and try again");
            expect(body.status_code).toBe(400);
          });
        });
      });
    });
  });
});
