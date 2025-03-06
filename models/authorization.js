function generateToken() {
  //
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, 0)).join("");
}

const authorization = {
  generateToken,
};

export default authorization;
