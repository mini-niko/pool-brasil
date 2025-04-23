import { Button } from "@/components/ui/button";
import Container from "@/interface/components/Container";
import NavigationBar from "@/interface/components/NavigationBar";
import { BriefcaseBusiness, Users } from "lucide-react";
import { useRouter } from "next/router";

function Admin() {
  return (
    <>
      <NavigationBar />
      <Container>
        <div className="text-center text-pool-black">
          <h1 className="font-bold text-2xl">OLÁ MAURÍCIO!</h1>
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
          router.push("/admin/clients");
        }}
        className="justify-center"
      >
        <Users className="h-6 w-6 mr-2" />
        <span className="mx-auto text-base">Gerenciar clientes</span>
      </Button>
      <Button
        onClick={() => {
          router.push("/admin/professionals");
        }}
        className="text-base"
      >
        <BriefcaseBusiness className="h-4 w-4 mr-2" />
        <span className="mx-auto text-base">Gerenciar funcionários</span>
      </Button>
    </div>
  );
}

export default Admin;
