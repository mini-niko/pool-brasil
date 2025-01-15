import router from "infra/router";
import users from "models/users";

const userRouter = router.post(handlerPost);

async function handlerPost(req, res) {
  const userData = JSON.parse(req.body);

  const user = await users.createUser(userData);

  res.status(201).json(user);
}

export default userRouter.handler();
