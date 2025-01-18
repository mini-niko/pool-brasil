import database from "infra/database";
import userValidation from "./validation/user";
import { cpf } from "cpf-cnpj-validator";

async function createUser(userData = {}) {
  userValidation.validate(userData);
  await userValidation.alreadyInUse(userData);

  const postUserResponse = await database.query(
    `WITH new_user AS (
      INSERT INTO users (name, cpf, email, password, birth_day) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id
    ) INSERT INTO addresses (user_id, state, city, street, number, complement, reference)
    VALUES ((SELECT id FROM new_user), $6, $7, $8, $9, $10, $11) RETURNING *;`,
    [
      userData.name,
      cpf.format(userData.cpf).replaceAll(".", "").replace("-", ""),
      userData.email,
      userData.password,
      userData.birth_day,
      userData.address.state,
      userData.address.city,
      userData.address.street,
      userData.address.number,
      userData.address.complement || "",
      userData.address.reference || "",
    ],
  );

  const userId = postUserResponse.rows[0].user_id;

  const userResponse = getUser("id", userId);

  return userResponse;
}

async function getUser(key, value) {
  if (key === "id") userValidation.validID(value);

  const response = await database.query(
    `SELECT u.*, a.* FROM users u
     LEFT JOIN addresses a ON u.id = a.user_id
     WHERE u.${key} = $1`,
    [value],
  );

  return formatUser(response.rows[0]);
}

function formatUser(data) {
  if (!data) return;

  return {
    id: data.user_id,
    name: data.name,
    cpf: data.cpf,
    email: data.email,
    password: data.password,
    features: data.features,
    birth_day: data.birth_day,
    created_at: data.created_at,
    updated_at: data.updated_at,
    address: {
      state: data.state,
      city: data.city,
      street: data.street,
      number: data.number,
      complement: data.complement,
      reference: data.reference,
    },
  };
}

const users = {
  createUser,
  getUser,
};

export default users;
