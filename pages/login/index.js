import EmailField from "components/form/EmailField";
import PasswordField from "components/form/PasswordField";
import Link from "next/link";
import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [disabled, setDisabled] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setDisabled(!disabled);

    //Some logic

    setTimeout(() => setDisabled(false), 2000);
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        className="bg-red-100 p-8 rounded-md flex flex-col items-center gap-4"
        onSubmit={onSubmit}
      >
        <fieldset className="flex flex-col p-4 justify-center items-center gap-4">
          <legend className="text-center text-xl font-bold w-min self-center">
            Entrar
          </legend>

          <EmailField email={email} setEmail={setEmail} />

          <PasswordField
            field={"password"}
            title={"Senha"}
            password={password}
            setPassword={setPassword}
          />
        </fieldset>

        <button
          className="bg-red-200 disabled:bg-red-300 rounded-md w-min py-2 px-4"
          disabled={disabled}
          type="submit"
        >
          Enviar
        </button>

        <p>
          Não possui uma conta?{" "}
          <Link className="font-semibold underline" href="/register">
            Crie uma agora!
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
