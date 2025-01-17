import { InternalServerError } from "errors";
import snakeize from "snakeize";

function handlerError(err, req, res) {
  let responseError = err;

  if (responseError.statusCode === 500 || !responseError.statusCode) {
    console.error(err);
    responseError = new InternalServerError({});
  }

  responseError = snakeize(responseError);

  return res.status(responseError.status_code).json(responseError);
}

async function parseJSON(req, res, next) {
  if (typeof req.body === "string" && req.body.length > 1)
    req.body = JSON.parse(req.body);

  await next();
}

const controller = {
  handlerError,
  parseJSON,
};

export default controller;
