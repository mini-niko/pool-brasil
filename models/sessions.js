import redis from "infra/redis";
import authorization from "./authorization";
import { serialize } from "cookie";

function setSessionCookieInResponse(res, token) {
  const cookieConfig = {
    httpOnly: true,
    secure: true,
    maxAge: parseInt(process.env.SESSION_TIME),
    sameSite: "Strict",
    path: "/",
  };

  res.setHeader("Set-Cookie", serialize("sessionToken", token, cookieConfig));
}

async function setSessionInRedis(user) {
  const token = authorization.generateToken();

  const sessionUser = JSON.stringify({
    id: user.id,
    name: user.name,
    features: user.features,
  });

  await redis.set(`session:${token}`, sessionUser, process.env.SESSION_TIME);

  return token;
}

async function createSession(user, res) {
  const token = await setSessionInRedis(user);

  setSessionCookieInResponse(res, token);

  return token;
}

async function getUserFromSession(sessionToken) {
  const query = await redis.search(`session:${sessionToken}`);

  if (!query) return null;

  const user = JSON.parse(query);

  return user;
}

const sessions = {
  createSession,
  getUserFromSession,
};

export default sessions;
