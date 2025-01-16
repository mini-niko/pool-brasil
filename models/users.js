import database from "infra/database";
import userValidation from "./validation/user";

async function createUser(userData) {
  userValidation.validate(userData);
  await userValidation.alreadyInUse(userData);

  const response = await database.query(
    `INSERT INTO users (name, cpf, email, password, birth_day) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
    [
      userData.name,
      userData.cpf,
      userData.email,
      userData.password,
      userData.birth_day,
    ],
  );

  return response.rows[0];
}

async function getUserByName(name) {
  const response = await database.query("SELECT * FROM users WHERE name = $1", [
    name,
  ]);

  return response.rows[0];
}

async function getUserByCPF(cpf) {
  const response = await database.query("SELECT * FROM users WHERE cpf = $1", [
    cpf,
  ]);

  return response.rows[0];
}

async function getUserByEmail(email) {
  const response = await database.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
  );

  return response.rows[0];
}

const users = {
  createUser,
  getUserByName,
  getUserByCPF,
  getUserByEmail,
};

export default users;
