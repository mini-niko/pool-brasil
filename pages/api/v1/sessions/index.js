import { NotFoundError, UnauthorizedError, ValidationError } from "errors";
import controller from "models/controllers";
import sessions from "models/sessions";
import users from "models/users";
import { createRouter } from "next-connect";

export default createRouter()
  .get(getHandler)
  .post(postHandler)
  .handler({ onError: controller.handlerError });

async function postHandler(req, res) {
  const login = req.body;

  const queryUser = await users.getUserByLogin(login.email, login.password);

  if (!queryUser)
    throw new UnauthorizedError({
      message: "The email and/or password don't match any account.",
      action: "Send an email and password valid.",
      stack: new Error().stack,
    });

  const token = await sessions.createSession(queryUser, res);

  res.status(201).json({ token });
}

async function getHandler(req, res) {
  const token = req.query.token || req.cookies.sessionToken;

  if (!token)
    throw new ValidationError({
      message: "Expected a token in the request, but it was not sent.",
      action: "Send an token in request.",
      stack: new Error().stack,
    });

  const user = await sessions.getUserFromSession(token);

  if (!user)
    throw new NotFoundError({
      message: "Not found an user with this session token.",
      action: "Send an valid session token or create a new session.",
      stack: new Error().stack,
    });

  res.status(200).json(user);
}
