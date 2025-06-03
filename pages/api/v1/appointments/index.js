import appointment from "@/models/appointment";
import authentication from "@/models/authentication";
import authorization from "@/models/authorization";
import controller from "@/models/controllers";
import { createRouter } from "next-connect";

export default createRouter()
  .use(authentication.injectUser)
  .put(authorization.canRequest(["client", "professional"]), putHandler)
  .handler({
    onError: controller.handlerError,
  });

async function putHandler(req, res) {
  const appointmentData = req.body;

  await appointment.updateAppointment(appointmentData);

  res.status(201).json();
}
