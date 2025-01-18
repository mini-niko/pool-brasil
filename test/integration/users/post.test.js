import orchestrator from "test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
  await orchestrator.upMigrations(() => {});
});

describe("POST to /api/v1/users", () => {
  describe("Annonymous user", () => {
    describe("Creating an user", () => {
      const user = {
        name: "Test",
        cpf: "07563801030",
        email: "example@test.com",
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

      function addUserAttributes(oldUser, newUser) {
        oldUser.id = newUser.id;
        oldUser.features = newUser.features;
        oldUser.birth_day = newUser.birth_day;
        oldUser.created_at = newUser.created_at;
        oldUser.updated_at = newUser.updated_at;
        delete oldUser.confirm_password;

        return oldUser;
      }

      test("Valid", async () => {
        let validUser = {
          ...user,
        };

        const response = await fetch("http://localhost:3000/api/v1/users", {
          method: "POST",
          body: JSON.stringify(validUser),
        });

        expect(response.status).toBe(201);

        const body = await response.json();

        validUser = addUserAttributes(validUser, body);

        expect(body).toEqual(validUser);
      });
      describe("Invalid:", () => {
        describe("With existent", () => {
          test("Name", async () => {
            const nameExistUser = {
              ...user,
              name: "Test",
            };

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(nameExistUser),
            });

            expect(response.status).toBe(409);

            const body = await response.json();

            expect(body.name).toBe("DuplicateError");
            expect(body.message).toBe("This name is already in use");
            expect(body.action).toBe("Try send another name");
            expect(body.status_code).toBe(409);
          });
          test("CPF", async () => {
            const cpfExistUser = {
              ...user,
              name: "Test again",
              cpf: "07563801030",
            };

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(cpfExistUser),
            });

            expect(response.status).toBe(409);

            const body = await response.json();

            expect(body.name).toBe("DuplicateError");
            expect(body.message).toBe("This cpf is already in use");
            expect(body.action).toBe("Try send another cpf");
            expect(body.status_code).toBe(409);
          });
          test("Email", async () => {
            const emailExistUser = {
              ...user,
              name: "Test again",
              cpf: "06124688018",
              email: "example@test.com",
            };

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(emailExistUser),
            });

            expect(response.status).toBe(409);

            const body = await response.json();

            expect(body.name).toBe("DuplicateError");
            expect(body.message).toBe("This email is already in use");
            expect(body.action).toBe("Try send another email");
            expect(body.status_code).toBe(409);
          });
        });
        describe("Without", () => {
          test("Name", async () => {
            const withoutNameUser = {
              ...user,
            };

            delete withoutNameUser.name;

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(withoutNameUser),
            });

            expect(response.status).toBe(400);

            const body = await response.json();

            expect(body.name).toBe("ValidationError");
            expect(body.message).toBe('"name" is required');
            expect(body.action).toBe("Try adjust your data and try again");
            expect(body.status_code).toBe(400);
          });
          test("CPF", async () => {
            const withoutCpfUser = {
              ...user,
            };

            delete withoutCpfUser.cpf;

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(withoutCpfUser),
            });

            expect(response.status).toBe(400);

            const body = await response.json();

            expect(body.name).toBe("ValidationError");
            expect(body.message).toBe('"cpf" is required');
            expect(body.action).toBe("Try adjust your data and try again");
            expect(body.status_code).toBe(400);
          });
          test("Email", async () => {
            const withoutEmailUser = {
              ...user,
            };

            delete withoutEmailUser.email;

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(withoutEmailUser),
            });

            expect(response.status).toBe(400);

            const body = await response.json();

            expect(body.name).toBe("ValidationError");
            expect(body.message).toBe('"email" is required');
            expect(body.action).toBe("Try adjust your data and try again");
            expect(body.status_code).toBe(400);
          });
          test("Password", async () => {
            const withoutPasswordUser = {
              ...user,
            };

            delete withoutPasswordUser.password;

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(withoutPasswordUser),
            });

            expect(response.status).toBe(400);

            const body = await response.json();

            expect(body.name).toBe("ValidationError");
            expect(body.message).toBe('"password" is required');
            expect(body.action).toBe("Try adjust your data and try again");
            expect(body.status_code).toBe(400);
          });
          test("Confirm password", async () => {
            const withoutConfirmPasswordUser = {
              ...user,
            };

            delete withoutConfirmPasswordUser.confirm_password;

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(withoutConfirmPasswordUser),
            });

            expect(response.status).toBe(400);

            const body = await response.json();

            expect(body.name).toBe("ValidationError");
            expect(body.message).toBe('"confirm_password" is required');
            expect(body.action).toBe("Try adjust your data and try again");
            expect(body.status_code).toBe(400);
          });
          test("Birthday", async () => {
            const withoutBirthdayUser = {
              ...user,
            };

            delete withoutBirthdayUser.birth_day;

            const response = await fetch("http://localhost:3000/api/v1/users", {
              method: "POST",
              body: JSON.stringify(withoutBirthdayUser),
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
