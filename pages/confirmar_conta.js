import Image from "next/image";
import Box from "./interface/components/Box";
import symbol from "public/principal-symbol.svg";

function ConfirmarConta() {
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
        className="w-fit px-8 py-24 md:px-12 gap-4 z-20 flex-1 justify-center text-center w-min"
      >
        <h1 className="font-bold text-3xl md:text-2xl whitespace-nowrap">
          Confirme sua conta
        </h1>
        <p className="text-xl md:text-lg md:leading-none">
          Enviamos um email para sua conta para finalizar o registro da sua nova
          conta. Pode demorar alguns minutos.
        </p>
        <p className="md:text-sm">
          Não recebeu o email? <a className="text-pool-dark">Clique aqui</a>{" "}
          para enviar outro email.
        </p>
      </Box>
    </Box>
  );
}

export default ConfirmarConta;
