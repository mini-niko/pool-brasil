import { createRouter } from "next-connect";
import users from "models/users";
import controller from "models/controllers";
import { ValidationError } from "errors";

export default createRouter()
  .use(controller.parseJSON)
  .get(handlerGet)
  .post(handlerPost)
  .handler({
    onError: controller.handlerError,
  });

async function handlerGet(req, res) {
  const userId = req.query.id;

  if (!userId)
    throw new ValidationError({
      message: "ID cannot be null.",
      action: "Add an valid user ID in request.",
    });

  const user = await users.getUserById(userId);

  if (!user) return res.status(404).end();

  res.status(200).json(user);
}

async function handlerPost(req, res) {
  const user = await users.createUser(req.body);

  res.status(201).json(user);
}
