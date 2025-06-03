import redis from "infra/redis";
import email from "./email";
import EmailComponent from "infra/component/email/ConfirmAccount";
import sessions from "./sessions";
import users from "./users";

async function injectUser(request, response, next) {
  const token = request.cookies["sessionToken"];

  const userSession = await sessions.getUserFromSession(token);

  const user = userSession
    ? await users.getUser("id", userSession.id)
    : users.getBlankUser();

  request.context = {
    ...request.context,
    user,
  };

  return next();
}

function generateToken() {
  const array = new Uint8Array(16); // eslint-disable-line no-undef
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, 0)).join("");
}

async function saveValueWithToken(prefix, value) {
  const token = generateToken();

  await redis.set(`${prefix}:${token}`, value);

  return token;
}

async function getValueWithToken(prefix, token) {
  const value = await redis.search(`${prefix}:${token}`);

  return value;
}

async function deleteValueWithToken(prefix, token) {
  await redis.del(`${prefix}:${token}`);
}

async function sendEmailToConfirmAccount(emailAdress, token) {
  const body = <EmailComponent token={token} />;

  email.sendMail(emailAdress, "Confirmação da conta", body);
}

const authentication = {
  generateToken,
  getValueWithToken,
  injectUser,
  saveValueWithToken,
  sendEmailToConfirmAccount,
  deleteValueWithToken,
};

export default authentication;
