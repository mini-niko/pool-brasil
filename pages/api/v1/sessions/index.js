import authentication from "@/models/authentication";
import { NotFoundError, UnauthorizedError } from "errors";
import controller from "models/controllers.js";
import sessions from "models/sessions";
import users from "models/users";
import { createRouter } from "next-connect";

export default createRouter()
  .use(authentication.injectUser)
  .get(getHandler)
  .post(postHandler)
  .handler({
    onError: controller.handlerError,
  });

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
  const user = req.context.user;

  if (!user || !user.id) {
    throw new NotFoundError({
      message: "Not found an user with this session token.",
      action: "Send an valid session token or create a new session.",
      stack: new Error().stack,
    });
  }

  res.status(200).json(user);
}
