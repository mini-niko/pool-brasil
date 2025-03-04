import { UnauthorizedError } from "errors";
import controller from "models/controllers";
import sessions from "models/sessions";
import users from "models/users";
import { createRouter } from "next-connect";

export default createRouter()
  .post(postHandler)
  .handler({ onError: controller.handlerError });

async function postHandler(req, res) {
  const login = req.body;

  const queryUser = await users.getUserByLogin(login.email, login.password);

  if (!queryUser)
    throw new UnauthorizedError({
      message: "The email and password don't match any account.",
      action: "Send an valid email and password",
      stack: new Error().stack,
    });

  const token = await sessions.createSession(queryUser, res);

  res.status(200).json({ token });
}
