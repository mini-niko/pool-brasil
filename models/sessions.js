import authentication from "models/authentication.js";
import { serialize } from "cookie";

function setSessionCookieInResponse(res, token) {
  const cookieConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: parseInt(process.env.SESSION_TIME),
    sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
    path: "/",
  };

  res.setHeader("Set-Cookie", serialize("sessionToken", token, cookieConfig));
}

async function setSessionInRedis(user) {
  const sessionUser = JSON.stringify({
    id: user.id,
    name: user.name,
    features: user.features,
  });

  const token = await authentication.saveValueWithToken("session", sessionUser);

  return token;
}

async function createSession(user, res) {
  const token = await setSessionInRedis(user);

  setSessionCookieInResponse(res, token);

  return token;
}

async function deleteSession(token) {
  await authentication.deleteValueWithToken("sessions", token);
}

async function getUserFromSession(sessionToken) {
  const query = await authentication.getValueWithToken("session", sessionToken);

  if (!query) return null;

  const user = JSON.parse(query);

  return user;
}

const sessions = {
  createSession,
  getUserFromSession,
  deleteSession,
};

export default sessions;
