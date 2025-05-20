import { createRouter } from "next-connect";
import users from "models/users";
import controller from "models/controllers";
import authentication from "@/models/authentication";
import authorization from "@/models/authorization";

export default createRouter()
  .use(authentication.injectUser)
  .get(authorization.canRequest(["admin"]), getHandler)
  .post(authorization.canRequest(["admin"]), postHandler)
  .handler({
    onError: controller.handlerError,
  });

async function getHandler(req, res) {
  const usersList = await users.getAllUsers();

  res.status(200).json(usersList);
}

async function postHandler(req, res) {
  console.log(req.body);

  const user = await users.createUser(req.body);

  res.status(201).json(user);
}
