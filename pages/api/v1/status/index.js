import database from "infra/database";
import router from "infra/router";

const statusRouter = router.get(getHandler);

async function getHandler(req, res) {
  const currentTime = new Date().toISOString();

  const databaseStatus = await database.status();

  const responseBody = {
    current_time: currentTime,
    database: databaseStatus,
  };

  res.status(200).json(responseBody);
}

export default statusRouter.handler();
