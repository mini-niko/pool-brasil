"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DefaultContainer from "@/components/ui/defaultContainer";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Confetti from "react-confetti";

function ContaConfirmada() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(true);
  const [isOk, setIsOk] = useState(false);

  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight });

    const confirm = async () => {
      try {
        const response = await fetch("/api/v1/user/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
          }),
        });

        const status = response.status;

        if (status !== 200) {
          setIsOk(false);
        }
      } catch (err) {
        setIsOk(false);
      } finally {
        setIsLoading(false);
      }
    };

    confirm();
  }, [token]);

  return (
    <>
      {!isLoading && !isOk && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <Confetti
            width={size.width}
            height={size.height}
            recycle={false}
            numberOfPieces={1000}
            tweenDuration={3000}
            gravity={0.3}
          />
        </div>
      )}
      <DefaultContainer>
        <Card className="items-center py-48 z-20 relative">
          {!isLoading && !isOk && (
            <>
              <OkComponent />
            </>
          )}
          {!isLoading && isOk && <ErrorComponent />}
        </Card>
      </DefaultContainer>
    </>
  );
}

function OkComponent() {
  return (
    <>
      <CardHeader className="w-[350px]">
        <CardTitle>
          <h1>Conta confirmada</h1>
        </CardTitle>
        <CardDescription>
          <p>Sua conta foi confirmada com sucesso!</p>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-center">
        <Link
          className="underline text-sm text-center hover:cursor-pointer"
          href="/login"
        >
          Ir para a página de login
        </Link>
      </CardFooter>
    </>
  );
}

function ErrorComponent() {
  return (
    <CardHeader className="w-[350px]">
      <CardTitle>
        <h1>Algo de errado aconteceu...</h1>
      </CardTitle>
      <CardDescription>
        <p>
          Você acessou a página com um token inválido. Pode acontecer caso o
          link de acesso expirou ou não possui o token.
          <br />
          Tente realizar o cadastro novamente.
        </p>
      </CardDescription>
      <CardFooter className="flex justify-center">
        <Link className="underline text-sm" href="/registro">
          Ir para a página de cadastro
        </Link>
      </CardFooter>
    </CardHeader>
  );
}

export default ContaConfirmada;
