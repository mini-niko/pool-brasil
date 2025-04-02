import redis from "infra/redis";

function generateToken() {
  const array = new Uint8Array(16); // eslint-disable-line no-undef
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, 0)).join("");
}

async function createToken(user) {
  const sessionUser = JSON.stringify({
    id: user.id,
    name: user.name,
    features: user.features,
  });

  const token = generateToken();

  await redis.set(`session:${token}`, sessionUser, process.env.SESSION_TIME);

  return token;
}

const authorization = {
  createToken,
};

export default authorization;
