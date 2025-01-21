import DateField from "components/form/DateField";
import EmailField from "components/form/EmailField";
import NumberField from "components/form/NumberField";
import PasswordField from "components/form/PasswordField";
import StateField from "components/form/StateField";
import TextField from "components/form/TextField";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

function Register() {
  const router = useRouter();

  const [user, setUser] = useState({
    name: "",
    cpf: "",
    email: "",
    password: "",
    confirm_password: "",
    birth_day: "",
  });

  const [address, setAddress] = useState({
    state: "",
    city: "",
    street: "",
    number: "",
    complement: "",
    reference: "",
  });

  const [disabled, setDisabled] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();

    setDisabled(!disabled);

    const userRequest = {
      ...user,
      address,
    };

    const res = await fetch("/api/v1/users", {
      method: "POST",
      body: JSON.stringify(userRequest),
    });

    if (res.status === 201) return router.push("/login");
    else if (res.json) console.log(await res.json());
    setDisabled(false);
  }

  function handleUserChange(e) {
    const { name, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }

  function handleAddressChange(e) {
    const { name, value } = e.target;

    setAddress((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
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
                text={user.name}
                setText={handleUserChange}
              />
              <TextField
                field={"cpf"}
                title={"CPF"}
                text={user.cpf}
                setText={handleUserChange}
              />
              <EmailField email={user.email} setEmail={handleUserChange} />
              <PasswordField
                field={"password"}
                title={"Senha"}
                password={user.password}
                setPassword={handleUserChange}
              />
              <PasswordField
                field={"confirm_password"}
                title={"Confirmar Senha"}
                password={user.confirm_password}
                setPassword={handleUserChange}
              />
              <DateField
                field={"birth_day"}
                title={"Data de Nascimento"}
                date={user.birth_day}
                setDate={handleUserChange}
              />
            </div>
            <div className="flex flex-col justify-start items-start gap-2">
              <StateField
                field={"state"}
                title={"Estado"}
                setState={handleAddressChange}
              />
              <TextField
                field={"city"}
                title={"Cidade"}
                text={address.city}
                setText={handleAddressChange}
              />
              <TextField
                field={"street"}
                title={"Endereço"}
                text={address.street}
                setText={handleAddressChange}
              />
              <NumberField
                field={"number"}
                title={"Número"}
                number={address.number}
                setNumber={handleAddressChange}
              />
              <TextField
                field={"complement"}
                title={"Complemento"}
                text={address.complement}
                setText={handleAddressChange}
              />
              <TextField
                field={"reference"}
                title={"Referência"}
                text={address.reference}
                setText={handleAddressChange}
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
          <Link className="font-semibold underline" href="/login">
            Entre na conta
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
