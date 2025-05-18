import controller from "@/models/controllers";
import { createRouter } from "next-connect";
import user from "../../user";
import { UnauthorizedError } from "@/errors";

export default createRouter().get(getHandler).handler({
  onError: controller.handlerError,
});
async function getHandler(req, res) {
  if (req.context?.user)
    throw new UnauthorizedError({
      message: "Não é possível deslogar um usuário não logado.",
      action: "",
    });

  res.setHeader(
    "Set-Cookie",
    "sessionToken=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax",
  );

  res.status(200).json();
}
