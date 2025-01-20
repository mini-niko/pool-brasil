import { data } from "autoprefixer";
import DateField from "components/form/DateField";
import EmailField from "components/form/EmailField";
import NumberField from "components/form/NumberField";
import PasswordField from "components/form/PasswordField";
import StateField from "components/form/StateField";
import TextField from "components/form/TextField";
import { useRouter } from "next/router";
import { useState } from "react";

function register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [reference, setReference] = useState("");

  const [disabled, setDisabled] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();

    setDisabled(!disabled);

    const user = {
      name,
      cpf,
      email,
      password,
      confirm_password: confirmPassword,
      birth_day: birthDay,
      address: {
        state,
        city,
        street,
        number,
        complement,
        reference,
      },
    };

    const res = await fetch("/api/v1/users", {
      method: "POST",
      body: JSON.stringify(user),
    });

    if (res.status === 201) return router.push("/login");

    setDisabled(false);
  }

  return (
    <div className="min-h-screen p-12 flex items-center justify-center">
      <form
        className="bg-red-100 p-8 rounded-md flex flex-col items-center gap-4"
        onSubmit={onSubmit}
      >
        <fieldset className="flex flex-col p-4 justify-center items-center gap-2">
          <legend className="text-center text-xl font-bold w-min self-center">
            Registro
          </legend>

          <div className="flex gap-4">
            <div className="flex flex-col justify-start items-start gap-2">
              <TextField
                field={"name"}
                title={"Nome completo"}
                text={name}
                setText={setName}
              />
              <TextField
                field={"cpf"}
                title={"CPF"}
                text={cpf}
                setText={setCpf}
              />
              <EmailField email={email} setEmail={setEmail} />
              <PasswordField
                field={"password"}
                title={"Senha"}
                password={password}
                setPassword={setPassword}
              />
              <PasswordField
                field={"confirm_password"}
                title={"Confirmar Senha"}
                password={confirmPassword}
                setPassword={setConfirmPassword}
              />
              <DateField
                field={"birth_day"}
                title={"Data de Nascimento"}
                date={birthDay}
                setDate={setBirthDay}
              />
            </div>
            <div className="flex flex-col justify-start items-start gap-2">
              <StateField
                field={"state"}
                title={"Estado"}
                setState={setState}
              />
              <TextField
                field={"city"}
                title={"Cidade"}
                text={city}
                setText={setCity}
              />
              <TextField
                field={"street"}
                title={"Endereço"}
                text={street}
                setText={setStreet}
              />
              <NumberField
                field={"number"}
                title={"Número"}
                number={number}
                setNumber={setNumber}
              />
              <TextField
                field={"complement"}
                title={"Complemento"}
                text={complement}
                setText={setComplement}
              />
              <TextField
                field={"reference"}
                title={"Referência"}
                text={reference}
                setText={setReference}
              />
            </div>
          </div>
        </fieldset>
        <button
          className="bg-red-200 disabled:bg-red-300 rounded-md w-min py-2 px-4"
          disabled={disabled}
          type="submit"
        >
          Enviar
        </button>

        <p>
          Já possui uma conta?{" "}
          <a className="font-semibold underline" href="/login">
            Entre na conta
          </a>
        </p>
      </form>
    </div>
  );
}

export default register;
