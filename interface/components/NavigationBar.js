import logo from "public/nome_branco.png";
import configIcon from "public/icons/config.svg";
import Image from "next/image";
import { Settings } from "lucide-react";

function NavigationBar() {
  return (
    <nav className="bg-pool-dark w-full px-4 md:px-8 flex items-center justify-between shadow-2xl shadow-pool-dark/25">
      <div className="hidden md:block w-8"></div>
      <div className="relative h-6 m-2 w-52">
        <Image className="object-contain" src={logo.src} alt="" fill />
      </div>
      <Settings className="w-8 h-8 m-2 text-pool-white" />
    </nav>
  );
}

export default NavigationBar;
