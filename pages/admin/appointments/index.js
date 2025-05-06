// ShadCN
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// Componentes próprios
import Container from "@/interface/components/Container";
import NavigationBar from "@/interface/components/NavigationBar";

// React/Next
import Link from "next/link";
import { useEffect, useState } from "react";

// Ícones
import { EllipsisVertical, Filter, RefreshCw, Search } from "lucide-react";

function Appointment() {
  const rawData = [
    {
      id: 1,
      client: {
        id: "c1",
        name: "José da Silva",
      },
      professional: {
        id: "p1",
        name: "Victor Hugo",
      },
      scheduled_for: "2025-07-05T17:30:00.000Z",
      created_at: "2025-05-05T16:14:35.000Z",
      status: "pending",
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Rua Rui Barbosa",
        number: 102,
        complement: "Apartamento 201",
        reference: "Próximo ao mercado central",
        latitude: "-26.8761358",
        longitude: "-52.4043425",
      },
    },
    {
      id: 2,
      client: {
        id: "c2",
        name: "Maria Fernanda",
      },
      professional: {
        id: "p1",
        name: "Victor Hugo",
      },
      scheduled_for: "2025-07-06T09:00:00.000Z",
      created_at: "2025-05-03T10:14:00.000Z",
      status: "confirmed",
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Avenida Brasil",
        number: 300,
        complement: "Sala 4",
        reference: "Em frente à prefeitura",
        latitude: "-26.875500",
        longitude: "-52.404800",
      },
    },
    {
      id: 3,
      client: {
        id: "c3",
        name: "Fernanda Lopes",
      },
      professional: {
        id: "p2",
        name: "Ana Paula",
      },
      scheduled_for: "2025-07-09T10:00:00.000Z",
      created_at: "2025-05-04T11:00:00.000Z",
      status: "confirmed",
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Rua Santos Dumont",
        number: 190,
        complement: "Casa nos fundos",
        reference: "Ao lado do posto Shell",
        latitude: "-26.876900",
        longitude: "-52.403900",
      },
    },
    {
      id: 4,
      client: {
        id: "c1",
        name: "José da Silva",
      },
      professional: {
        id: "p2",
        name: "Ana Paula",
      },
      scheduled_for: "2025-07-10T15:00:00.000Z",
      created_at: "2025-05-01T17:30:00.000Z",
      status: "pending",
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Rua Marechal Bormann",
        number: 55,
        complement: "",
        reference: "Esquina com a farmácia São João",
        latitude: "-26.875600",
        longitude: "-52.405700",
      },
    },
    {
      id: 5,
      client: {
        id: "c4",
        name: "Luana Costa",
      },
      professional: {
        id: "p1",
        name: "Victor Hugo",
      },
      scheduled_for: "2025-07-07T14:30:00.000Z",
      created_at: "2025-05-01T08:22:10.000Z",
      status: "canceled",
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Rua Coronel Passos Maia",
        number: 250,
        complement: "",
        reference: "Próximo ao Fórum",
        latitude: "-26.874800",
        longitude: "-52.406200",
      },
    },
    {
      id: 6,
      client: {
        id: "c2",
        name: "Maria Fernanda",
      },
      professional: {
        id: "p2",
        name: "Ana Paula",
      },
      scheduled_for: "2025-07-11T08:30:00.000Z",
      created_at: "2025-05-02T08:00:00.000Z",
      status: "done",
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Rua Olavo Bilac",
        number: 77,
        complement: "Apartamento 302",
        reference: "Edifício Bella Vista",
        latitude: "-26.876700",
        longitude: "-52.406500",
      },
    },
  ];

  const [data, setData] = useState(rawData);

  return (
    <>
      <NavigationBar />
      <Container className="gap-4">
        <div className="text-center text-pool-black">
          <h1 className="font-bold text-2xl">Agendamentos</h1>
          <h2 className="text-lg">Gerencie os agendamentos do seu sistema.</h2>
        </div>
        <div className="gap-4 flex flex-col-reverse md:flex-row items-center justify-between w-full md:w-3/4">
          <SearchItems rawData={rawData} setData={setData} />
        </div>
        <AppointmentTable data={data} />
        <Link className="underline text-pool-black" href="/admin">
          Voltar à página principal
        </Link>
      </Container>
    </>
  );
}

function SearchItems({ rawData, setData }) {
  const [filter, setFilter] = useState("");
  const [filterKey, setFilterKey] = useState("client_name");

  function onChange() {
    const data = rawData.filter((item) =>
      item[filterKey].toLowerCase().includes(filter.toLowerCase()),
    );

    setData(data);
  }

  return (
    <div className="flex gap-1">
      <Input
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
          onChange();
        }}
      />
      <Button onClick={onChange} variant="outline">
        {filter ? (
          <Search className="h-4 w-4" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
      </Button>
      <FilterOptions filterKey={filterKey} setFilterKey={setFilterKey}>
        <Button variant="outline">
          <Filter className="h-4 w-4" />
        </Button>
      </FilterOptions>
    </div>
  );
}

function FilterOptions({ children, filterKey, setFilterKey }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Opções de filtro</DialogTitle>
          <DialogDescription>
            Selecione quais dos parâmetros deve filtrar.
          </DialogDescription>
          <div className="mt-2 flex justify-center gap-2">
            <Button
              onClick={() => setFilterKey("client_name")}
              variant={filterKey === "client_name" ? "default" : "outline"}
            >
              Nome do Cliente
            </Button>
            <Button
              onClick={() => setFilterKey("professional_name")}
              variant={
                filterKey === "professional_name" ? "default" : "outline"
              }
            >
              Nome do Profissonal
            </Button>
            <Button
              onClick={() => setFilterKey("status")}
              variant={filterKey === "status" ? "default" : "outline"}
            >
              Status
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function AppointmentTable({ data }) {
  const statusTranslator = {
    pending: "Pendente",
    confirmed: "Confirmado",
    canceled: "Cancelado",
    done: "Finalizado",
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-base">
          <TableHead>Cliente</TableHead>
          <TableHead>Profissional</TableHead>
          <TableHead className="hidden md:table-cell">Agendado para</TableHead>
          <TableHead className="hidden md:table-cell">Criado em</TableHead>
          <TableHead className="hidden md:table-cell">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((appointment) => {
          return (
            <TableRow key={appointment.id} className="justify-center">
              <TableCell>{appointment.client.name}</TableCell>
              <TableCell>{appointment.professional.name}</TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(appointment.scheduled_for).toLocaleString("pt-BR")}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(appointment.created_at).toLocaleString("pt-BR")}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {statusTranslator[appointment.status]}
              </TableCell>
              <TableCell>
                <AppointmentOptions appointment={appointment} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function AppointmentOptions({ appointment }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="fit">
          <EllipsisVertical className="w-8 h-8" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <AppointmentDetails appointment={appointment} />
        <AppointmentDelete />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AppointmentDetails({ appointment }) {
  const users = [
    {
      id: "c1",
      name: "José da Silva",
      email: "jose.silva@gmail.com",
      cpf: "12345678901",
      birth_day: "1985-04-20T00:00:00Z",
      created_at: "2025-04-10T09:00:00Z",
      updated_at: "2025-04-10T09:00:00Z",
      features: ["client"],
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Rua Rui Barbosa",
        number: 102,
        complement: "Apartamento 201",
        reference: "Próximo ao mercado central",
      },
    },
    {
      id: "c2",
      name: "Maria Fernanda",
      email: "maria.fernanda@gmail.com",
      cpf: "23456789012",
      birth_day: "1990-06-15T00:00:00Z",
      created_at: "2025-04-08T13:30:00Z",
      updated_at: "2025-04-08T13:30:00Z",
      features: ["client"],
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Avenida Brasil",
        number: 300,
        complement: "Sala 4",
        reference: "Em frente à prefeitura",
      },
    },
    {
      id: "c3",
      name: "Fernanda Lopes",
      email: "fernanda.lopes@gmail.com",
      cpf: "34567890123",
      birth_day: "1988-03-25T00:00:00Z",
      created_at: "2025-04-11T16:00:00Z",
      updated_at: "2025-04-11T16:00:00Z",
      features: ["client"],
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Rua Santos Dumont",
        number: 190,
        complement: "Casa nos fundos",
        reference: "Ao lado do posto Shell",
      },
    },
    {
      id: "c4",
      name: "Luana Costa",
      email: "luana.costa@gmail.com",
      cpf: "45678901234",
      birth_day: "1995-09-12T00:00:00Z",
      created_at: "2025-04-07T11:10:00Z",
      updated_at: "2025-04-07T11:10:00Z",
      features: ["client"],
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Rua Coronel Passos Maia",
        number: 250,
        complement: "",
        reference: "Próximo ao Fórum",
      },
    },
    {
      id: "p1",
      name: "Victor Hugo",
      email: "victor.hugo@exemplo.com",
      cpf: "56789012345",
      birth_day: "1983-01-05T00:00:00Z",
      created_at: "2025-04-01T08:00:00Z",
      updated_at: "2025-04-01T08:00:00Z",
      features: ["professional"],
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Rua Victor Konder",
        number: 88,
        complement: "",
        reference: "Próximo ao ginásio",
      },
    },
    {
      id: "p2",
      name: "Ana Paula",
      email: "ana.paula@exemplo.com",
      cpf: "67890123456",
      birth_day: "1991-07-18T00:00:00Z",
      created_at: "2025-04-02T14:30:00Z",
      updated_at: "2025-04-02T14:30:00Z",
      features: ["professional"],
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Rua Olavo Bilac",
        number: 77,
        complement: "Apartamento 302",
        reference: "Edifício Bella Vista",
      },
    },
  ];

  const statusTranslator = {
    pending: "Pendente",
    confirmed: "Confirmado",
    canceled: "Cancelado",
    done: "Finalizado",
  };

  const [client, setClient] = useState("");
  const [professional, setProfessional] = useState("");

  useEffect(() => {
    const searchClient = users.find(
      (user) => user.id === appointment.client.id,
    );
    const searchProfessional = users.find(
      (user) => user.id === appointment.professional.id,
    );

    setClient(searchClient);
    setProfessional(searchProfessional);
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem>Detalhes</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes do agendamento</DialogTitle>
          <DialogDescription>
            Veja com mais detalhes os dados do agendamento.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="client" className="w-full gap-4">
          <TabsList className="self-center">
            <TabsTrigger value="client">Cliente</TabsTrigger>
            <TabsTrigger value="professional">Profissional</TabsTrigger>
            <TabsTrigger value="address">Endereço</TabsTrigger>
            <TabsTrigger value="other">Outros</TabsTrigger>
          </TabsList>
          <TabsContent value="client">
            <div className="flex flex-col w-full">
              <div className="flex gap-4 my-2 w-full">
                <Label htmlFor="name" className="w-1/3 justify-end">
                  Nome
                </Label>
                <Input
                  className="w-2/3 disabled:opacity-100 disabled:cursor-default"
                  id="name"
                  disabled
                  value={client.name}
                />
              </div>
              <div className="flex gap-4 my-2 w-full">
                <Label htmlFor="cpf" className="w-1/3 justify-end">
                  CPF
                </Label>
                <Input
                  className="w-2/3 disabled:opacity-100 disabled:cursor-default"
                  id="cpf"
                  disabled
                  value={client.cpf}
                />
              </div>
              <div className="flex gap-4 my-2 w-full">
                <Label htmlFor="email" className="w-1/3 justify-end">
                  Email
                </Label>
                <Input
                  className="w-2/3 disabled:opacity-100 disabled:cursor-default"
                  id="email"
                  disabled
                  value={client.email}
                />
              </div>
              <div className="flex gap-4 my-2 w-full">
                <Label
                  htmlFor="birthday"
                  className="w-1/3 justify-end text-end"
                >
                  Data de nascimento
                </Label>
                <div className="w-2/3">
                  <Input
                    className="w-fit disabled:opacity-100 disabled:cursor-default"
                    id="birthday"
                    type="date"
                    disabled
                    value={new Date(client.birth_day)
                      .toLocaleDateString("pt-BR")
                      .split("/")
                      .reverse()
                      .join("-")}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="professional">
            <div className="flex flex-col w-full">
              <div className="flex gap-4 my-2 w-full">
                <Label htmlFor="name" className="w-1/3 justify-end">
                  Nome
                </Label>
                <Input
                  className="w-2/3 disabled:opacity-100 disabled:cursor-default"
                  id="name"
                  disabled
                  value={professional.name}
                />
              </div>
              <div className="flex gap-4 my-2 w-full">
                <Label htmlFor="cpf" className="w-1/3 justify-end">
                  CPF
                </Label>
                <Input
                  className="w-2/3 disabled:opacity-100 disabled:cursor-default"
                  id="cpf"
                  disabled
                  value={professional.cpf}
                />
              </div>
              <div className="flex gap-4 my-2 w-full">
                <Label htmlFor="email" className="w-1/3 justify-end">
                  Email
                </Label>
                <Input
                  className="w-2/3 disabled:opacity-100 disabled:cursor-default"
                  id="email"
                  disabled
                  value={professional.email}
                />
              </div>
              <div className="flex gap-4 my-2 w-full">
                <Label
                  htmlFor="birthday"
                  className="w-1/3 justify-end text-end"
                >
                  Data de nascimento
                </Label>
                <div className="w-2/3">
                  <Input
                    className="w-fit disabled:opacity-100 disabled:cursor-default"
                    id="birthday"
                    type="date"
                    disabled
                    value={new Date(professional.birth_day)
                      .toLocaleDateString("pt-BR")
                      .split("/")
                      .reverse()
                      .join("-")}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="address">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <div className="flex flex-row gap-4 my-2">
                  <Label className="w-1/3 justify-end" htmlFor="street">
                    Rua
                  </Label>
                  <Input
                    className="w-2/3 disabled:opacity-100 disabled:cursor-default"
                    id="street"
                    disabled
                    value={appointment.address.street}
                  />
                </div>

                <div className="flex flex-row gap-4 my-2">
                  <Label className="w-1/3 justify-end" htmlFor="number">
                    Número
                  </Label>
                  <div className="w-2/3">
                    <Input
                      className="w-1/3 md:w-1/5 disabled:opacity-100 disabled:cursor-default"
                      id="number"
                      disabled
                      value={appointment.address.number}
                    />
                  </div>
                </div>

                <div className="flex flex-row gap-4 my-2">
                  <Label className="w-1/3 justify-end" htmlFor="complement">
                    Complemento
                  </Label>
                  <div className="w-2/3">
                    <Input
                      className="md:w-2/3 disabled:opacity-100 disabled:cursor-default"
                      id="complement"
                      disabled
                      value={appointment.address.complement}
                    />
                  </div>
                </div>

                <div className="flex flex-row gap-4 my-2">
                  <Label className="w-1/3 justify-end" htmlFor="state">
                    Estado
                  </Label>
                  <div className="w-2/3">
                    <Input
                      className="w-1/3 md:w-1/6 disabled:opacity-100 disabled:cursor-default"
                      id="state"
                      disabled
                      value={appointment.address.state}
                    />
                  </div>
                </div>

                <div className="flex flex-row gap-4 my-2">
                  <Label className="w-1/3 justify-end" htmlFor="city">
                    Cidade
                  </Label>
                  <div className="w-2/3">
                    <Input
                      className="w-2/3 disabled:opacity-100 disabled:cursor-default"
                      id="city"
                      disabled
                      value={appointment.address.city}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="other">
            <div className="flex flex-col">
              <div className="flex flex-col">
                <div className="flex flex-row justify-center gap-4 my-2">
                  <Label
                    className="w-1/3 justify-end text-end"
                    htmlFor="street"
                  >
                    Criado em
                  </Label>
                  <Input
                    className="w-3/5 md:w-1/2 disabled:opacity-100 disabled:cursor-default"
                    id="street"
                    disabled
                    value={new Date(appointment.created_at).toLocaleString(
                      "pt-BR",
                    )}
                  />
                </div>

                <div className="flex flex-row justify-center gap-4 my-2">
                  <Label
                    className="w-1/3 justify-end text-end"
                    htmlFor="number"
                  >
                    Agendado para
                  </Label>
                  <Input
                    className="w-3/5 md:w-1/2 disabled:opacity-100 disabled:cursor-default"
                    id="street"
                    disabled
                    value={new Date(appointment.scheduled_for).toLocaleString(
                      "pt-BR",
                    )}
                  />
                </div>
                <div className="flex flex-row justify-center gap-4 my-2">
                  <Label className="w-1/3 justify-end" htmlFor="number">
                    Status atual
                  </Label>
                  <Input
                    className="w-3/5 md:w-1/2 disabled:opacity-100 disabled:cursor-default"
                    id="street"
                    disabled
                    value={statusTranslator[appointment.status]}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function AppointmentDelete() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem>Deletar</DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Atenção</AlertDialogTitle>
        </AlertDialogHeader>
        <p className="text-center md:text-start">
          Ao confirmar, você irá passar o status do agendamento para
          "Cancelado". Tem certeza que deseja fazer isto?
        </p>
        <AlertDialogFooter className="mt-2 flex-row justify-end">
          <AlertDialogAction>
            <Button size="sm">Cancelar</Button>
          </AlertDialogAction>
          <AlertDialogCancel asChild>
            <Button size="sm" variant="outline">
              Confirmar
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Appointment;
