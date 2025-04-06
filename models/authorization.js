import redis from "infra/redis";
import email from "./email";
import EmailComponent from "infra/component/email/ConfirmAccount";

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

async function sendEmailToConfirmAccount(emailAdress, token) {
  const body = <EmailComponent token={token} />;

  email.sendMail(emailAdress, "Confirmação da conta", body);
}

const authorization = {
  saveValueWithToken,
  getValueWithToken,
  sendEmailToConfirmAccount,
};

export default authorization;
