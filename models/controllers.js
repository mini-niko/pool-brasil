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

const controller = {
  handlerError,
};

export default controller;
