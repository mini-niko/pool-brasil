import DefaultContainer from "@/components/ui/defaultContainer";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

function ConfirmarConta() {
  return (
    <DefaultContainer>
      <Card className="items-center py-48 z-20 relative">
        <CardHeader className="w-[350px]">
          <CardTitle>
            <h1>Confirme sua conta</h1>
          </CardTitle>
          <CardDescription>
            <p>
              Enviamos um email para sua conta para finalizar o registro da sua
              nova conta. Pode demorar alguns minutos.
            </p>
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link className="underline text-sm" href="/login">
            Ir para a página de login
          </Link>
        </CardFooter>
      </Card>
    </DefaultContainer>
  );
}

export default ConfirmarConta;
