import appointment from "@/models/appointment";
import authentication from "@/models/authentication";
import authorization from "@/models/authorization";
import controller from "@/models/controllers";
import { createRouter } from "next-connect";

export default createRouter()
  .use(authentication.injectUser)
  .post(authorization.canRequest(["client", "professional"]), postHandler)
  .get(authorization.canRequest(["client", "professional"]), getHandler)
  .handler({
    onError: controller.handlerError,
  });

async function postHandler(req, res) {
  const appointmentData = req.body;

  const newAppointment = await appointment.createAppointment(appointmentData);

  res.status(201).json(newAppointment);
}

async function getHandler(req, res) {
  const userId = req.context.user.id;

  const appointments = await appointment.getAllAppointmentsFromUserId(userId);

  return res.status(200).json(appointments);
}
