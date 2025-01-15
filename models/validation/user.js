import { ValidationError } from "errors";
import Joi from "joi";
const minimumAge = 16;

const dateMinimumAge = new Date().setFullYear(
  new Date().getFullYear() - minimumAge,
);

const userSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  cpf: Joi.string()
    .pattern(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/)
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(60).required(),
  birth_day: Joi.date().iso().max(dateMinimumAge).required(),
});

function validate(userData) {
  try {
    userData = JSON.parse(JSON.stringify(userData));
  } catch (err) {
    throw new ValidationError({
      message: "Cannot parse the sent data.",
      action: "Check if the data is a valid JSON and try again.",
      stack: new Error().stack,
    });
  }

  const error = userSchema.validate(userData).error?.details[0];

  console.log(new Date(userData.birth_day));

  if (error) throw new ValidationError({ message: error.message });
}

const user = {
  validate,
};

export default user;
