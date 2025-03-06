import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import DefaultContainer from "./interface/components/DefaultContainer";
import Input from "./interface/components/Input";
import Form from "./interface/components/Form";
import TitleSubtitle from "./interface/components/TitleSubtitle";
import useUser from "./interface/hooks/useUser";

function Login() {
  return (
    <DefaultContainer>
      <LoginForm />
    </DefaultContainer>
  );
}

function LoginForm() {
  const { fetchUser } = useUser();

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e) {
    e.preventDefault();

    const formData = {
      email,
      password,
    };

    const { status } = await fetch("/api/v1/sessions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (status === 201) {
      fetchUser();
      router.replace("/");
    }
  }

  const fields = (
    <>
      <Input
        label="Email"
        name="email"
        value={email}
        setValue={setEmail}
        placeholder="exemplo@email.com"
      />
      <Input
        label="Senha"
        name="password"
        value={password}
        setValue={setPassword}
      >
        <a
          href="recuperar-senha"
          className="mt-4 self-end text-sm md:text-xs text-pool-dark"
        >
          Esqueceu a senha?
        </a>
      </Input>
    </>
  );

  return (
    <Form
      title={
        <TitleSubtitle
          title="Login"
          subtitle="Preencha os campos para realizar o login"
        />
      }
      fields={fields}
      onSubmit={onSubmit}
      buttonLabel={"Entrar"}
    >
      <p className="md:text-sm">
        <span className="text-pool-dark">Não possui uma conta? </span>
        <Link className="underline" href="/registro">
          Criar agora
        </Link>
      </p>
    </Form>
  );
}

export default Login;
