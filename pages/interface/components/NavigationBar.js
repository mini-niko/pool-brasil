import logo from "public/nome_branco.png";
import configIcon from "public/icons/config.svg";
import Image from "next/image";

function NavigationBar() {
  return (
    <nav className="bg-pool-dark w-full px-8 py-4 flex justify-between shadow-2xl shadow-pool-dark/25">
      <div className="w-8"></div>
      <Image className="h-8" src={logo.src} alt="" />
      <Image className="h-8" src={configIcon.src} alt="" />
    </nav>
  );
}

export default NavigationBar;
