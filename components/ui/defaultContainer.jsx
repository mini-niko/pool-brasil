import Image from "next/image";
import symbol from "public/principal-symbol.svg";

function DefaultContainer({ children }) {
  return (
    <div className="flex items-center justify-center min-h-screen p-8 w-screen rounded-none relative bg-pool-light">
      <div className="items-center justify-center z-10 hidden md:flex absolute">
        <Image
          height={symbol.height}
          width={symbol.width}
          className="w-max md:w-72"
          src={symbol.src}
          alt=""
          priority
        />
        <Image
          height={symbol.height}
          width={symbol.width}
          className="w-max md:w-72"
          src={symbol.src}
          alt=""
          priority
        />
      </div>
      {children}
    </div>
  );
}

export default DefaultContainer;
