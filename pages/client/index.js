import { useRouter } from "next/router";
import useUser from "interface/hooks/useUser";
import NavigationBar from "interface/components/NavigationBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ClockFading, Loader2 } from "lucide-react";
import { useState } from "react";
import Container from "@/interface/components/Container";

function Index() {
  const router = useRouter();

  const { user, isLoading } = useUser();

  const [agendaLabel, setAgendaLabel] = useState(
    <>
      Realizar
      <br />
      Agendamento
    </>,
  );

  const [historyLabel, setHistoryLabel] = useState(
    <>
      Visualizar
      <br />
      Histórico
    </>,
  );

  const [disabled, setDisabled] = useState(false);

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <NavigationBar />
      <Container>
        <div className="text-center text-pool-black">
          <h1 className="font-bold text-2xl">
            OLÁ {user?.name.split(" ")[0]}!
          </h1>
          <h2 className="text-lg ">Como podemos te ajudar hoje?</h2>
        </div>
        <div className="flex justify-center gap-12 flex-wrap">
          <div className="flex flex-col items-center">
            <Card className="bg-pool-light px-12 py-8">
              <CardContent className="p-0 flex flex-col items-center gap-4">
                <Calendar className="h-24 w-auto" />
                <p className="h-24 font-bold text-pool-white text-xl gap-12">
                  Agendamento
                </p>
              </CardContent>
            </Card>
            <Button
              disabled={disabled}
              variant="secondary"
              onClick={() => {
                setDisabled(true);
                setAgendaLabel(
                  <Loader2 className="animate-spin !h-8 !w-8 m-2" />,
                );
                router.push("/client/agendamento");
              }}
              className="flex -mt-11 w-40 py-4 px-8 text-center text-md h-fit font-light text-pool-dark"
            >
              {agendaLabel}
            </Button>
          </div>
          <div className="flex flex-col items-center">
            <Card className="bg-pool-light px-12 py-8">
              <CardContent className="p-0 flex flex-col items-center gap-4">
                <ClockFading className="h-24 w-auto" />
                <p className="h-24 font-bold text-pool-white text-xl gap-12 text-center">
                  Histórico de <br /> Agendamento
                </p>
              </CardContent>
            </Card>
            <Button
              variant="secondary"
              disabled={disabled}
              onClick={() => {
                setDisabled(true);
                setHistoryLabel(
                  <Loader2 className="animate-spin !h-8 !w-8 m-2" />,
                );
                router.push("/client/historico");
              }}
              className="-mt-11 w-40 py-4 px-8 text-center text-md h-fit font-light text-pool-dark"
            >
              {historyLabel}
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Index;
