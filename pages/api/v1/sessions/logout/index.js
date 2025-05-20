import controller from "@/models/controllers";
import { createRouter } from "next-connect";
import { serialize } from "cookie";
import sessions from "@/models/sessions";

export default createRouter().get(getHandler).handler({
  onError: controller.handlerError,
});
async function getHandler(req, res) {
  const token = req.cookies["sessionToken"];

  sessions.deleteSession(token);

  res.setHeader("Set-Cookie", [
    serialize("sessionToken", "invalid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: -1,
    }),
  ]);

  res.status(200).end();
}
