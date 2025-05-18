import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import Form from "@/components/ui/Form";
import useUser from "interface/hooks/useUser";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DefaultContainer from "@/components/ui/defaultContainer";

function Login() {
  return (
    <DefaultContainer>
      <LoginForm />
    </DefaultContainer>
  );
}

function LoginForm() {
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
      router.replace("/client");
    }
  }

  const fields = [
    <>
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="exemplo@email.com"
      />
    </>,
    <>
      <Label htmlFor="password">Senha</Label>
      <Input
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />
    </>,
  ];

  const footer = (
    <p className="text-sm">
      <span>Não possui uma conta? </span>
      <Link className="underline text-pool-black" href="/registro">
        Criar agora
      </Link>
    </p>
  );

  return (
    <Form
      title="Login"
      subtitle="Preencha os campos para realizar o login"
      fields={fields}
      onClick={onSubmit}
      buttonLabel={"Entrar"}
      footer={footer}
    />
  );
}

export default Login;
