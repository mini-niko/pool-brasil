import { cpf } from "cpf-cnpj-validator";
import { DuplicateError, ValidationError } from "errors";
import Joi from "joi";
import users from "models/users";
const minimumAge = 16;

const dateMinimumAge = new Date().setFullYear(
  new Date().getFullYear() - minimumAge,
);

const userSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .custom((value, helpers) => {
      return /^[A-Za-zÀ-ÿ]+(?:[-'\s][A-Za-zÀ-ÿ]+)*$/.test(value)
        ? value
        : helpers.error("any.invalid");
    }),
  cpf: Joi.string()
    .required()
    .custom((value, helpers) => {
      return cpf.isValid(value) ? value : helpers.error("any.invalid");
    }),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(60).required(),
  confirm_password: Joi.valid(Joi.ref("password")).required(),
  birth_day: Joi.date().iso().max(dateMinimumAge).required(),
});

function validate(userData) {
  try {
    userData = JSON.parse(JSON.stringify(userData));
  } catch {
    throw new ValidationError({
      message: "Cannot parse the sent data.",
      action: "Check if the data is a valid JSON and try again.",
      stack: new Error().stack,
    });
  }

  const error = userSchema.validate(userData).error?.details[0];

  if (error)
    throw new ValidationError({
      message: error.message,
      stack: new Error().stack,
    });
}

async function alreadyInUse(userData) {
  const nameInUse = (await users.getUserByName(userData.name)) !== undefined;
  if (nameInUse)
    throw new DuplicateError({
      message: "This name is already in use",
      action: "Try send another name",
    });

  const cpfInUse = (await users.getUserByCPF(userData.cpf)) !== undefined;
  if (cpfInUse)
    throw new DuplicateError({
      message: "This CPF is already in use",
      action: "Enter in your account with this CPF",
    });

  const emailInUse = (await users.getUserByEmail(userData.email)) !== undefined;
  if (emailInUse)
    throw new DuplicateError({
      message: "This email is already in use",
      action: "Enter with you email or send another email",
    });
}

const userValidation = {
  validate,
  alreadyInUse,
};

export default userValidation;
