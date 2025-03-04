import authorization from "./authorization";
import { serialize } from "cookie";

async function createSession(user, res) {
  const token = await authorization.createToken(user);

  const cookieConfig = {
    httpOnly: true,
    secure: true,
    maxAge: parseInt(process.env.SESSION_TIME),
    sameSite: "Strict",
  };

  res.setHeader("Set-Cookie", serialize("sessionToken", token, cookieConfig));

  return token;
}

const sessions = {
  createSession,
};

export default sessions;
