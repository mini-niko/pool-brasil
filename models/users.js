import database from "infra/database";
import userValidation from "./validation/user";
import { cpf } from "cpf-cnpj-validator";
import authentication from "models/authentication.js";
import { NotFoundError, ValidationError } from "errors";

async function createUser(userData = {}) {
  userData.cpf =
    typeof userData.cpf === "string"
      ? cpf.format(userData.cpf).replaceAll(".", "").replace("-", "")
      : userData.cpf;

  userValidation.validate(userData);
  await userValidation.alreadyInUse(userData);

  userData.password = await authentication.hashPassword(userData.password);

  const postUserResponse = await database.query(
    `
    WITH 
      new_user AS (
        INSERT INTO users (
          name, 
          cpf, 
          email, 
          password, 
          birth_day, 
          features
        ) 
        VALUES (
          $1, $2, $3, $4, $5, $6
        ) 
        RETURNING id
      ) 
    
    INSERT INTO addresses (
      user_id, 
      state, 
      city, 
      street, 
      number, 
      complement, 
      reference
    ) 
    VALUES (
      (SELECT id FROM new_user), 
      $7, $8, $9, $10, $11, $12
    ) 
    RETURNING 
      *
    ;`,
    [
      userData.name,
      userData.cpf,
      userData.email,
      userData.password,
      userData.birth_day,
      userData.features || [],
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
    `
    SELECT 
      u.*, 
      a.*
    FROM 
      users u
    LEFT JOIN 
      addresses a 
      ON u.id = a.user_id
    WHERE 
      u.${key} = $1;
    `,
    [value],
  );

  return formatUser(response.rows[0]);
}

async function getUserByLogin(email, password) {
  const response = await database.query(
    `
    SELECT 
      u.name,
      u.email,
      u.features,
      u.birth_day,
      u.created_at,
      u.updated_at,
      u.password,
      a.*,
      u.id as user_id
    FROM 
      users u
    LEFT JOIN
      addresses a 
    ON 
      u.id = a.user_id
    WHERE 
      u.email = $1
    ;`,
    [email],
  );

  const user = response.rows[0];

  const hashedPassword = user ? user.password : "";

  await authentication.compareHashPassword(password, hashedPassword);

  return formatUser(user);
}

async function getAllUsers() {
  const response = await database.query(
    `
    SELECT
      u.id as user_id,
      u.name,
      u.cpf,
      u.email,
      u.features,
      u.birth_day,
      u.created_at,
      u.updated_at,
      a.* 
    FROM 
      users u
    LEFT JOIN
      addresses a 
    ON 
      u.id = a.user_id
    ;`,
  );

  return response.rows.map((user) => formatUser(user));
}

async function updateUser(id, data) {
  userValidation.validID(id);

  if (Object.keys(data).length === 0)
    throw new ValidationError({
      message:
        "Você precisa adicionar, no minímo, um campo para ser modificado.",
      action: "Envie um campo para alterar.",
      stack: new Error().stack,
    });

  let fieldsForQuery = Object.keys(data)
    .map((val, i) => `${val} = $${i + 1}`)
    .join(", ");
  fieldsForQuery += ", updated_at = NOW()";

  let valuesForQuery = Object.values(data);
  valuesForQuery.push(id);

  const idIndex = valuesForQuery.length;

  const response = await database.query(
    `
    UPDATE
      users
    SET
      ${fieldsForQuery}
    WHERE
      id = $${idIndex}
    RETURNING
      *
    ;`,
    valuesForQuery,
  );

  return formatUser(response.rows[0]);
}

async function deleteUser(id) {
  userValidation.validID(id);

  await database.query(
    `
    DELETE FROM
      users
    WHERE
      id = $1
    ;`,
    [id],
  );
}

async function confirmAccount(token) {
  const userId = await authentication.getValueWithToken("confirmation", token);

  if (!userId)
    throw new NotFoundError({
      message: "There is no pending confirmation with this token.",
      action: "Send an valid confirm token or request a new confirmation.",
    });

  const user = await updateUser(userId, { features: ["client"] });

  if (!user)
    throw new NotFoundError({
      message: "The confirmation's account does not exists or is invalid.",
      action: "Send an valid confirm token or request a new confirmation.",
    });

  return userId;
}

function formatUser(data) {
  if (!data) return;

  const {
    user_id,
    state,
    city,
    street,
    number,
    complement,
    reference,
    ...rest
  } = data;

  return {
    ...rest,
    id: user_id,
    address: {
      state,
      city,
      street,
      number,
      complement,
      reference,
    },
  };
}

function getBlankUser() {
  return {
    name: null,
    email: null,
    cpf: null,
    birth_day: null,
    created_at: null,
    updated_at: null,
    features: [],
    address: {
      state: null,
      city: null,
      street: null,
      number: null,
      complement: null,
      reference: null,
    },
  };
}

const users = {
  createUser,
  confirmAccount,
  deleteUser,
  getAllUsers,
  getBlankUser,
  getUser,
  getUserByLogin,
  updateUser,
};

export default users;
