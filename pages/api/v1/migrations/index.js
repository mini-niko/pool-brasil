import authentication from "@/models/authentication";
import authorization from "@/models/authorization";
import controller from "@/models/controllers";
import migrator from "infra/migrator";
import { createRouter } from "next-connect";

export default createRouter()
  .use(authentication.injectUser)
  .get(authorization.canRequest(["admin"]), getHandler)
  .post(authorization.canRequest(["admin"]), postHandler)
  .handler({
    onError: controller.handlerError,
  });

async function getHandler(req, res) {
  const pendingMigrations = await migrator.listPendingMigrations();

  return res.status(200).json(pendingMigrations);
}

async function postHandler(req, res) {
  const pendingMigrations = await migrator.runPendingMigrations();

  if (pendingMigrations.length === 0)
    return res.status(200).json(pendingMigrations);

  return res.status(201).json(pendingMigrations);
}
