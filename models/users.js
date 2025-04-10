import database from "infra/database";
import userValidation from "./validation/user";
import { cpf } from "cpf-cnpj-validator";
import authorization from "./authorization";
import { NotFoundError } from "errors";

async function createUser(userData = {}) {
  userData.cpf = cpf.format(userData.cpf).replaceAll(".", "").replace("-", "");

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
      userData.cpf,
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

async function getUserByLogin(email, password) {
  const response = await database.query(
    `SELECT u.*, a.* FROM users u
     LEFT JOIN addresses a ON u.id = a.user_id
     WHERE u.email = $1 AND u.password = $2`,
    [email, password],
  );

  return formatUser(response.rows[0]);
}

async function updateUser(searchKey, searchValue, updateKey, updateValue) {
  if (searchKey === "id") userValidation.validID(searchValue);

  const response = await database.query(
    `UPDATE users
     SET ${updateKey} = $1
     WHERE ${searchKey} = $2
     RETURNING *;`,
    [updateValue, searchValue],
  );

  return formatUser(response.rows[0]);
}

async function confirmAccount(token) {
  const userId = await authorization.getValueWithToken("confirmation", token);

  if (!userId)
    throw new NotFoundError({
      message: "There is no pending confirmation with this token.",
      action: "Send an valid confirm token or request a new confirmation.",
    });

  const user = await updateUser("id", userId, "features", ["client"]);

  if (!user)
    throw new NotFoundError({
      message: "The confirmation's account does not exists or is invalid.",
      action: "Send an valid confirm token or request a new confirmation.",
    });

  return userId;
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
  getUserByLogin,
  createUser,
  getUser,
  confirmAccount,
};

export default users;
