import { createRouter } from "next-connect";
import users from "models/users";
import controller from "models/controllers";
import { ValidationError } from "errors";
import authorization from "@/models/authentication";

export default createRouter().get(getHandler).post(postHandler).handler({
  onError: controller.handlerError,
});

async function getHandler(req, res) {
  const userId = req.query.id;

  if (!userId)
    throw new ValidationError({
      message: "ID cannot be null.",
      action: "Add an valid user ID in request.",
    });

  const user = await users.getUser("id", userId);

  if (!user) return res.status(404).end();

  res.status(200).json(user);
}

async function postHandler(req, res) {
  const user = await users.createUser(req.body);

  const token = await authorization.saveValueWithToken("confirmation", user.id);

  authorization.sendEmailToConfirmAccount(user.email, token);

  res.status(201).end();
}
