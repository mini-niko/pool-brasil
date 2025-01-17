import database from "infra/database";
import { createRouter } from "next-connect";

export default createRouter().get(getHandler).handler();

async function getHandler(req, res) {
  const currentTime = new Date().toISOString();

  const databaseStatus = await database.status();

  const responseBody = {
    current_time: currentTime,
    database: databaseStatus,
  };

  res.status(200).json(responseBody);
}
