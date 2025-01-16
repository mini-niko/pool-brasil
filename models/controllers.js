import { InternalServerError } from "errors";
import snakeize from "snakeize";

function handlerError(err, req, res) {
  let responseError = !err.statusCode ? new InternalServerError({}) : err;

  responseError = snakeize(responseError);

  return res.status(responseError.status_code).json(responseError);
}

async function parseJSON(req, res, next) {
  try {
    req.body = JSON.parse(req.body);
  } catch {
    throw new InternalServerError({ stack: new Error().stack });
  }

  await next();
}

const controller = {
  handlerError,
  parseJSON,
};

export default controller;
