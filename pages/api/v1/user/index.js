import { createRouter } from "next-connect";
import users from "models/users";
import controller from "models/controllers";
import { ValidationError } from "errors";
import authentication from "@/models/authentication";

export default createRouter()
  .use(authentication.injectUser)
  .get(getHandler)
  .post(postHandler)
  .handler({
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
  const userToPost = {
    ...req.body,
    features: ["client"],
  };

  const user = await users.createUser(userToPost);

  const token = await authentication.saveValueWithToken(
    "confirmation",
    user.id,
  );

  authentication.sendEmailToConfirmAccount(user.email, token);

  res.status(201).end();
}
