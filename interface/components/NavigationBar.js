import logo from "public/nome_branco.png";
import configIcon from "public/icons/config.svg";
import Image from "next/image";

function NavigationBar() {
  return (
    <nav className="bg-pool-dark w-full px-8 py-4 flex items-center justify-between shadow-2xl shadow-pool-dark/25">
      <div className="w-8"></div>
      <Image
        className="bg-pool-dark h-6 md:h-8 object-contain"
        src={logo.src}
        alt=""
        height={logo.height}
        width={logo.width}
      />
      <Image
        className="h-6 md:h-8 object-contain"
        height={configIcon.height}
        width={configIcon.width}
        src={configIcon.src}
        alt=""
      />
    </nav>
  );
}

export default NavigationBar;
