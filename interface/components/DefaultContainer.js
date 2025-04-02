import Box from "./Box";
import Image from "next/image";
import symbol from "public/principal-symbol.svg";

function DefaultContainer({ children }) {
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
      {children}
    </Box>
  );
}

export default DefaultContainer;
