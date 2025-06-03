import { createRouter } from "next-connect";
import users from "models/users";
import controller from "models/controllers";
import authentication from "@/models/authentication";
import authorization from "@/models/authorization";

export default createRouter()
  .use(authentication.injectUser)
  .get(authorization.canRequest(["admin"]), getHandler)
  .post(authorization.canRequest(["admin"]), postHandler)
  .patch(authorization.canRequest(["admin"]), patchHandler)
  .delete(authorization.canRequest(["admin"]), deleteHandler)
  .handler({
    onError: controller.handlerError,
  });

async function getHandler(req, res) {
  const usersList = await users.getAllUsers();

  res.status(200).json(usersList);
}

async function postHandler(req, res) {
  const user = await users.createUser(req.body);

  res.status(201).json(user);
}

async function patchHandler(req, res) {
  const {
    body: data,
    query: { id },
  } = req;

  const user = await users.updateUser(id, data);

  res.status(200).json(user);
}

async function deleteHandler(req, res) {
  const {
    query: { id },
  } = req;

  await users.deleteUser(id);

  res.status(200).end();
}
