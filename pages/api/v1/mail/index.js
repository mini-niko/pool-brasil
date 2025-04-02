import { createRouter } from "next-connect";
import controller from "models/controllers";
import email from "models/email";

export default createRouter().get(getHandler).handler({
  onError: controller.handlerError,
});

async function getHandler(req, res) {
  const mail = await email.sendMail("xavierdeoliveiramauricio@gmail.com");

  res.status(200).json(mail);
}
