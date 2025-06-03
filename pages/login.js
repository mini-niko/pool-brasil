import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import Form from "@/components/ui/Form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DefaultContainer from "@/components/ui/defaultContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  const Footer = () => (
    <p className="w-full text-sm text-center">
      <span>Não possui uma conta? </span>
      <Link className="underline text-pool-black" href="/registro">
        Criar agora
      </Link>
    </p>
  );

  return (
    <>
      <Card className="z-20 relative">
        <CardHeader className="w-[350px]">
          <CardTitle>
            <h1>Login</h1>
          </CardTitle>
          <CardDescription>
            <h2>Insira suas credenciais para entrar.</h2>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form steps={[fields]} onSubmit={onSubmit} />
        </CardContent>
        <CardFooter>
          <Footer />
        </CardFooter>
      </Card>
    </>
  );
}

export default Login;
