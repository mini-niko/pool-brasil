import Image from "next/image";
import Box from "./interface/components/Box";
import symbol from "public/principal-symbol.svg";
import Link from "next/link";

function Login() {
  return (
    <Box
      box={true}
      flex={true}
      direction="col"
      items="center"
      justify="center"
      color="light"
      className="p-8 min-h-screen w-screen rounded-none relative"
    >
      <Box
        flex={true}
        items="center"
        justify="center"
        className="z-10 hidden md:flex absolute"
      >
        <Image
          height={symbol.height}
          width={symbol.width}
          className="w-max md:w-72"
          src={symbol.src}
          alt=""
        />
        <Image
          height={symbol.height}
          width={symbol.width}
          className="w-max md:w-72"
          src={symbol.src}
          alt=""
        />
      </Box>
      <Box
        box={true}
        flex={true}
        direction="col"
        items="center"
        justify="center"
        gap={4}
        color={"white"}
        className="w-fit px-8 py-24 md:px-12 gap-4 z-20 flex-1 justify-center"
      >
        <h1 className="font-bold text-3xl md:text-2xl">Login</h1>
        <form
          className="flex flex-col items-center gap-8"
          onSubmit={(e) => e.preventDefault}
        >
          <Box
            id="fields-box"
            flex={true}
            direction="col"
            items="center"
            justify="center"
            gap={8}
            className="gap-4"
          >
            <Box id="email-field-box" flex={true} direction="col" gap={1}>
              <label className="font-bold text-pool-dark text-xl md:text-lg">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="focus:outline-none rounded-md drop-shadow-xl w-64 px-4 py-2 text-sm md:px-3 md:py-1 md:text-xs shadow-pool-light/25 text-pool-dark"
                placeholder="exemplo@email.com"
              />
            </Box>
            <Box id="password-field-box" flex={true} direction="col" gap={1}>
              <label className="font-bold text-pool-dark text-xl md:text-lg">
                Senha
              </label>
              <input
                type="password"
                name="password"
                className="focus:outline-none rounded-md text-sm drop-shadow-xl w-64 px-4 py-2 md:px-3 md:py-1 md:text-xs shadow-pool-light/25 text-pool-dark"
              />
              <a
                href="recuperar-senha"
                className="mt-4 self-end text-sm md:text-xs text-pool-dark"
              >
                Esqueceu a senha?
              </a>
            </Box>
          </Box>
          <Box box={true} flex={true} color={"dark"} className="rounded-md">
            <button
              className="py-4 px-8 md:py-3 md:px-6 md:text-sm text-pool-white"
              type="submit"
            >
              Entrar
            </button>
          </Box>
        </form>
        <p className="md:text-sm">
          <span className="text-pool-dark">Não possui uma conta? </span>
          <Link className="underline" href="/registro">
            Criar agora
          </Link>
        </p>
      </Box>
    </Box>
  );
}

export default Login;
