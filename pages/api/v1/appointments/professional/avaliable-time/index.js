import appointment from "@/models/appointment";
import authentication from "@/models/authentication";
import authorization from "@/models/authorization";
import controller from "@/models/controllers";
import { createRouter } from "next-connect";

export default createRouter()
  .use(authentication.injectUser)
  .get(authorization.canRequest(["client", "professional"]), getHandler)
  .handler({
    onError: controller.handlerError,
  });

async function getHandler(req, res) {
  const { id, date } = req.query;

  const avaliableHours = await appointment.getAvaliableHoursForProfessional(
    id,
    date,
  );

  res.status(200).json(avaliableHours);
}
