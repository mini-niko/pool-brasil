import bcrypt from "bcryptjs";

async function hash(string) {
  return await bcrypt.hash(string, getSaltRounds());
}

async function compareHash(string, hash) {
  return await bcrypt.compare(string, hash);
}

function getSaltRounds() {
  let saltRounds = 10;

  return saltRounds;
}

const security = {
  compareHash,
  hash,
};

export default security;
