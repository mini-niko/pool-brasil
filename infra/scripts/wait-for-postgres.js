const { exec } = require("node:child_process");

console.log("");
checkPostgres();

const loading = loadingFunc();

function checkPostgres() {
  exec(
    "docker exec pool-postgres-dev pg_isready --host localhost",
    handleReturn,
  );

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      checkPostgres();
      return;
    }
    clearInterval(loading);
    process.stdout.write("\r");
    console.log("🟢 Postgres está aceitando conexões\n");
  }
}

function loadingFunc() {
  const loadingArray = ["\\", "|", "/", "⎯"];
  let i = 0;

  return setInterval(() => {
    process.stdout.write(
      `\r🔴 Aguardando por Postgres... ${loadingArray[i++ % loadingArray.length]} `,
    );
  }, 150);
}
