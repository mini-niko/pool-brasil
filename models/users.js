import database from "infra/database";

async function createUser(userData) {
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

const users = {
  createUser,
};

export default users;
