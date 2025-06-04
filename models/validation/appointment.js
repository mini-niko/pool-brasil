import { ValidationError } from "@/errors";
import Joi from "joi";

const daysInAdvance = 2;

const minDate = new Date().setDate(new Date().getDate() + daysInAdvance);

const customFilters = {
  utcString(value, helpers) {
    if (!value) return;
    return /^[A-Za-zÀ-ÿ0-9.,\s]+$/.test(value)
      ? value
      : helpers.error("any.invalid");
  },
};

const appointmentSchema = Joi.object({
  client_id: Joi.string().uuid().required(),
  professional_id: Joi.string().uuid().required(),
  date_time: Joi.date().iso().min(minDate).required(),
  service_id: Joi.number().min(1).max(2).precision(0).required(),
  location: Joi.object({
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
    complement: Joi.string()
      .min(0)
      .max(20)
      .custom(customFilters.utcString)
      .optional(),
    reference: Joi.string()
      .min(0)
      .max(40)
      .custom(customFilters.utcString)
      .optional(),
    latitude: Joi.number().min(-90).max(90).precision(6).required(),
    longitude: Joi.number().min(-90).max(90).precision(6).required(),
  }).required(),
});

function validate(appointmentData) {
  try {
    appointmentData = JSON.parse(JSON.stringify(appointmentData));
  } catch {
    throw new ValidationError({
      message: "Cannot parse the sent data.",
      action: "Check if the data is a valid JSON and try again.",
      stack: new Error().stack,
    });
  }

  const error = appointmentSchema.validate(appointmentData).error?.details[0];

  if (error) {
    throw new ValidationError({
      message: error.message,
      stack: new Error().stack,
    });
  }
}

function validateDate(date) {
  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  if (!regex.test(date)) {
    throw new ValidationError({
      message: "A data enviada não é uma data válida.",
      action: "Verifique a data e tente novamente.",
      stack: new Error().stack,
    });
  }
}

const appointmentValidation = {
  validate,
  validateDate,
};

export default appointmentValidation;
