import { createRouter } from "next-connect";
import controller from "models/controllers";
import users from "models/users";
import { ValidationError } from "errors";

export default createRouter().post(postHandler).handler({
  onError: controller.handlerError,
});

async function postHandler(req, res) {
  const token = req.body.token;

  console.log(token);

  if (!token)
    throw new ValidationError({
      message: "'token' cannot be null.",
      action: "Send an valid token in request.",
    });

  const userId = await users.confirmAccount(token);

  res.status(200).json({ user_id: userId });
}
