import { InternalServerError } from "errors";
import snakeize from "snakeize";

function handlerError(err, req, res) {
  let responseError = err;
  console.error(err);
  if (responseError.statusCode === 500 || !responseError.statusCode) {
    responseError = new InternalServerError({});
  }

  responseError = snakeize(responseError);

  return res.status(responseError.status_code).json(responseError);
}

const controller = {
  handlerError,
};

export default controller;
