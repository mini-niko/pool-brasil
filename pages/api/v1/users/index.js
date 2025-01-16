import { createRouter } from "next-connect";
import users from "models/users";
import controller from "models/controllers";

export default createRouter()
  .use(controller.parseJSON)
  .get(handlerGet)
  .post(handlerPost)
  .handler({
    onError: controller.handlerError,
  });

async function handlerGet(req, res) {
  const userId = req.query.id;

  const user = await users.getUserById(userId);

  res.status(200).json(user);
}

async function handlerPost(req, res) {
  const user = await users.createUser(req.body);

  res.status(201).json(user);
}
