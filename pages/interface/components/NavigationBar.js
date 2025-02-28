import logo from "public/nome_branco.png";
import configIcon from "public/icons/config.svg";

function NavigationBar() {
  return (
    <nav className="bg-pool-dark px-8 py-4 flex justify-between">
      <div className="w-8"></div>
      <img className="h-8" src={logo.src} />
      <img className="h-8" src={configIcon.src} />
    </nav>
  );
}

export default NavigationBar;
