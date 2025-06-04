import { cpf } from "cpf-cnpj-validator";
import { DuplicateError, ValidationError } from "errors";
import Joi from "joi";
import users from "models/users";

const dateMinimumAge = new Date().setFullYear(new Date().getFullYear() - 16);

const customFilters = {
  name(value, helpers) {
    return /^[A-Za-zÀ-ÿ]+(?:[-'\s][A-Za-zÀ-ÿ]+)*$/.test(value)
      ? value
      : helpers.error("any.invalid");
  },
  utcString(value, helpers) {
    if (!value) return;
    return /^[A-Za-zÀ-ÿ0-9.,\s]+$/.test(value)
      ? value
      : helpers.error("any.invalid");
  },
  cpf(value, helpers) {
    return cpf.isValid(value) ? value : helpers.error("any.invalid");
  },
};

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().custom(customFilters.name),
  cpf: Joi.string().required().custom(customFilters.cpf),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(60).required(),
  confirm_password: Joi.valid(Joi.ref("password")).required(),
  birth_day: Joi.date().iso().max(dateMinimumAge).required(),
  features: Joi.array()
    .items(Joi.string().valid("client", "admin", "professional"))
    .required(),
  address: Joi.object({
    state: Joi.string().alphanum().length(2).required(),
    city: Joi.string()
      .min(3)
      .max(25)
      .required()
      .custom(customFilters.utcString),
    street: Joi.string()
      .min(3)
      .max(100)
      .required()
      .custom(customFilters.utcString),
    number: Joi.number().integer().min(0).max(999999).required(),
    complement: Joi.string().min(0).max(20).custom(customFilters.utcString),
    reference: Joi.string().min(0).max(40).custom(customFilters.utcString),
  }).required(),
});

const publicUserSchema = Joi.object({
  id: Joi.string().length(36).required(),
  name: Joi.string().min(3).max(30).required().custom(customFilters.name),
  cpf: Joi.string().required().custom(customFilters.cpf),
  email: Joi.string().email().required(),
  birth_day: Joi.date().iso().max(dateMinimumAge).required(),
  created_at: Joi.date().iso().required(),
  updated_at: Joi.date().iso().required(),
  features: Joi.array()
    .items(Joi.string().valid("client", "admin", "professional"))
    .required(),
  address: Joi.object({
    state: Joi.string().alphanum().length(2).required(),
    city: Joi.string()
      .min(3)
      .max(25)
      .required()
      .custom(customFilters.utcString),
    street: Joi.string()
      .min(3)
      .max(100)
      .required()
      .custom(customFilters.utcString),
    number: Joi.number().integer().min(0).max(999999).required(),
    complement: Joi.string().min(0).max(20).custom(customFilters.utcString),
    reference: Joi.string().min(0).max(40).custom(customFilters.utcString),
  }),
});

function validID(id) {
  const regex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  if (!regex.test(id))
    throw new ValidationError({
      message: '"id" must be and uuid id.',
      action: "Try send an valid id.",
      stack: new Error().stack,
    });
}

function validate(userData) {
  try {
    userData = JSON.parse(JSON.stringify(userData));
  } catch {
    throw new ValidationError({
      message: "Cannot parse the sent data.",
      action: "Check if the data is a valid JSON and try again.",
    });
  }

  const error = userSchema.validate(userData).error?.details[0];

  if (error)
    throw new ValidationError({
      message: error.message,
    });
}

async function alreadyInUse(userData) {
  // eslint-disable-next-line no-undef
  let checks = await Promise.all([
    await checkDuplicate("name", userData),
    await checkDuplicate("cpf", userData),
    await checkDuplicate("email", userData),
    await null,
  ]);

  checks = checks.filter((value) => value != null);

  if (checks.length > 0) {
    throw new DuplicateError({
      message: `This ${checks[0]} is already in use`,
      action: `Try send another ${checks[0]}`,
    });
  }
}

async function checkDuplicate(field, userData) {
  const userExists =
    (await users.getUser(field, userData[field])) !== undefined;
  if (userExists) {
    return field;
  }
  return null;
}

const userValidation = {
  alreadyInUse,
  userSchema,
  publicUserSchema,
  validate,
  validID,
};

export default userValidation;
