import { Button } from "@/components/ui/button";
import Container from "@/interface/components/Container";
import NavigationBar from "@/interface/components/NavigationBar";
import useUser from "@/interface/hooks/useUser";
import { CalendarClock, Users } from "lucide-react";
import { useRouter } from "next/router";

function Admin() {
  const { user } = useUser();

  const name = user ? user.name.split(" ")[0] : "";

  return (
    <>
      <NavigationBar />
      <Container>
        <div className="text-center text-pool-black">
          <h1 className="font-bold text-2xl">OLÁ {name}!</h1>
          <h2 className="text-lg ">O que irá fazer hoje?</h2>
        </div>
        <Options />
      </Container>
    </>
  );
}

function Options() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => {
          router.push("/admin/users");
        }}
        className="justify-center"
      >
        <Users className="h-6 w-6 mr-2" />
        <span className="mx-auto text-base">Gerenciar usuários</span>
      </Button>
      <Button
        onClick={() => {
          router.push("/admin/appointments");
        }}
        className="text-base"
      >
        <CalendarClock />
        <span className="mx-auto text-base">Gerenciar agendamentos</span>
      </Button>
    </div>
  );
}

export default Admin;
