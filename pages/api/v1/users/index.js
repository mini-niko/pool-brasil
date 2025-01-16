import { createRouter } from "next-connect";
import users from "models/users";
import controller from "models/controllers";

export default createRouter()
  .use(controller.parseJSON)
  .post(handlerPost)
  .handler({
    onError: controller.handlerError,
  });

async function handlerPost(req, res) {
  const user = await users.createUser(req.body);

  res.status(201).json(user);
}
