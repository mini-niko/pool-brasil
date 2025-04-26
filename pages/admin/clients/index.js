import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
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
import Container from "@/interface/components/Container";
import NavigationBar from "@/interface/components/NavigationBar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { CirclePlus, EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

function Clients() {
  return (
    <>
      <NavigationBar />
      <Container className="gap-4">
        <div className="text-center text-pool-black">
          <h1 className="font-bold text-2xl">Clientes</h1>
          <h2 className="text-lg">Gerencie seus clientes.</h2>
        </div>
        <CreateAccount />
        <ClientsTable />
        <Link className="underline text-pool-black" href="/admin">
          Voltar à página principal
        </Link>
      </Container>
    </>
  );
}

function CreateAccount() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CirclePlus className="h-8, w-8" /> Criar nova conta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar nova conta</DialogTitle>
          <DialogDescription>
            Adicione os dados abaixo para criar uma nova conta.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function ClientsTable() {
  const clients = [
    {
      name: "José da Silva",
      email: "jose.silva@gmail.com",
      cpf: "123.456.789-00",
      birth_day: "15/02/1990",
      creation_data: "10/04/2025, às 19:23",
      last_update_data: "10/04/2025, às 19:23",
      state: "SC",
      city: "Xanxerê",
      street: "Rua Rui Barbosa",
      number: 102,
      complement: "Apartamento 201",
      reference: "Próximo ao mercado central",
    },
    {
      name: "Maria Oliveira",
      email: "maria.oliveira@yahoo.com",
      cpf: "234.567.890-11",
      birth_day: "23/07/1987",
      creation_data: "11/04/2025, às 08:15",
      last_update_data: "11/04/2025, às 08:15",
      state: "SC",
      city: "Xanxerê",
      street: "Avenida Brasil",
      number: 450,
      complement: null,
      reference: "Em frente à praça principal",
    },
    {
      name: "Carlos Souza",
      email: "carlos.souza@hotmail.com",
      cpf: "345.678.901-22",
      birth_day: "09/11/1992",
      creation_data: "12/04/2025, às 14:42",
      last_update_data: "12/04/2025, às 14:42",
      state: "SC",
      city: "Xanxerê",
      street: "Rua Anita Garibaldi",
      number: 230,
      complement: "Casa",
      reference: "Perto da escola estadual",
    },
    {
      name: "Ana Paula Costa",
      email: "ana.paula@gmail.com",
      cpf: "456.789.012-33",
      birth_day: "01/03/1995",
      creation_data: "13/04/2025, às 16:30",
      last_update_data: "13/04/2025, às 16:30",
      state: "SC",
      city: "Xanxerê",
      street: "Rua Victor Konder",
      number: 89,
      complement: null,
      reference: "Ao lado da farmácia São João",
    },
    {
      name: "Fernando Lima",
      email: "fernando.lima@outlook.com",
      cpf: "567.890.123-44",
      birth_day: "17/05/1989",
      creation_data: "13/04/2025, às 10:05",
      last_update_data: "13/04/2025, às 10:05",
      state: "SC",
      city: "Xanxerê",
      street: "Rua Olavo Bilac",
      number: 152,
      complement: "Fundos",
      reference: "Atrás da padaria Pão Quente",
    },
    {
      name: "Juliana Martins",
      email: "juliana.martins@gmail.com",
      cpf: "678.901.234-55",
      birth_day: "29/08/1993",
      creation_data: "14/04/2025, às 09:20",
      last_update_data: "14/04/2025, às 09:20",
      state: "SC",
      city: "Xanxerê",
      street: "Rua Rui Barbosa",
      number: 118,
      complement: "Sala 3",
      reference: "Próximo ao shopping center",
    },
    {
      name: "Rafael Pereira",
      email: "rafael.pereira@uol.com.br",
      cpf: "789.012.345-66",
      birth_day: "10/12/1991",
      creation_data: "14/04/2025, às 18:00",
      last_update_data: "14/04/2025, às 18:00",
      state: "SC",
      city: "Xanxerê",
      street: "Rua Anita Garibaldi",
      number: 320,
      complement: null,
      reference: "Atrás da academia Fitness Plus",
    },
    {
      name: "Larissa Fernandes",
      email: "larissa.fernandes@gmail.com",
      cpf: "890.123.456-77",
      birth_day: "06/04/1996",
      creation_data: "15/04/2025, às 11:47",
      last_update_data: "15/04/2025, às 11:47",
      state: "SC",
      city: "Xanxerê",
      street: "Rua Victor Konder",
      number: 75,
      complement: "Cobertura",
      reference: "Em cima da pizzaria Don Juan",
    },
    {
      name: "Bruno Rocha",
      email: "bruno.rocha@icloud.com",
      cpf: "901.234.567-88",
      birth_day: "18/06/1990",
      creation_data: "15/04/2025, às 15:35",
      last_update_data: "15/04/2025, às 15:35",
      state: "SC",
      city: "Xanxerê",
      street: "Avenida Brasil",
      number: 580,
      complement: "Loja 2",
      reference: "Ao lado da loja Americanas",
    },
    {
      name: "Camila Ribeiro",
      email: "camila.ribeiro@gmail.com",
      cpf: "012.345.678-99",
      birth_day: "22/01/1994",
      creation_data: "16/04/2025, às 13:12",
      last_update_data: "16/04/2025, às 13:12",
      state: "SC",
      city: "Xanxerê",
      street: "Rua Olavo Bilac",
      number: 240,
      complement: null,
      reference: "Em frente ao colégio São Francisco",
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-base">
          <TableHead>Nome</TableHead>
          <TableHead>CPF</TableHead>
          <TableHead className="hidden md:table-cell">Email</TableHead>
          <TableHead className="hidden md:table-cell">
            Data de nascimento
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client, index) => {
          return (
            <TableRow key={index} className="justify-center">
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.cpf}</TableCell>
              <TableCell className="hidden md:table-cell">
                {client.email}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {client.birth_day}
              </TableCell>
              <TableCell>
                <UserOptions data={client}>
                  <Button variant="ghost" size="fit">
                    <EllipsisVertical className="w-8 h-8" />
                  </Button>
                </UserOptions>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function UserOptions({ children, data }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <UserUpdate>
          <DropdownMenuItem>Atualizar</DropdownMenuItem>
        </UserUpdate>
        <UserDelete>
          <DropdownMenuItem>Deletar</DropdownMenuItem>
        </UserDelete>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserUpdate({ children, data }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar cliente</DialogTitle>
          <DialogDescription>
            Altere os dados que deseja editar. Caso não queira alterar, deixe em
            branco.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="account" className="w-full gap-4">
          <TabsList className="self-center">
            <TabsTrigger value="account">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="adress">Endereço</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <div className="flex flex-col">
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="client">Cliente</Label>
                <Input
                  className="w-2/3 disabled:opacity-100 disabled:cursor-default"
                  id="client"
                />
              </div>
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="client">CPF</Label>
                <Input
                  className="w-1/2 disabled:opacity-100 disabled:cursor-default"
                  id="client"
                />
              </div>
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="client">Email</Label>
                <Input
                  className="w-2/3 disabled:opacity-100 disabled:cursor-default"
                  id="client"
                />
              </div>
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="client">Data de nascimento</Label>
                <Input
                  className="w-fit disabled:opacity-100 disabled:cursor-default"
                  id="client"
                  type="date"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="adress">
            <div className="flex flex-col">
              <div className="flex gap-4 items-stretch">
                <div className="flex w-5/6 flex-col gap-2 my-2">
                  <Label htmlFor="client">Rua</Label>
                  <Input
                    className="w-full disabled:opacity-100 disabled:cursor-default"
                    id="client"
                  />
                </div>
                <div className="flex w-1/6 flex-col gap-2 my-2">
                  <Label htmlFor="client">Número</Label>
                  <Input
                    className="w-full disabled:opacity-100 disabled:cursor-default"
                    id="client"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex w-1/2 flex-col gap-2 my-2">
                  <Label htmlFor="client">Complemento</Label>
                  <Input
                    className="w-full disabled:opacity-100 disabled:cursor-default"
                    id="client"
                  />
                </div>
                <div className="flex w-1/2 flex-col gap-2 my-2">
                  <Label htmlFor="client">Número</Label>
                  <Input
                    className="w-full disabled:opacity-100 disabled:cursor-default"
                    id="client"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex w-1/6 flex-col gap-2 my-2">
                  <Label htmlFor="client">Estado</Label>
                  <Input
                    className="w-full disabled:opacity-100 disabled:cursor-default"
                    id="client"
                  />
                </div>
                <div className="flex w-1/2 flex-col gap-2 my-2">
                  <Label htmlFor="client">Cidade</Label>
                  <Input
                    className="w-full disabled:opacity-100 disabled:cursor-default"
                    id="client"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Atualizar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UserDelete({ children }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Atenção</AlertDialogTitle>
          <AlertDialogDescription>Deletar uma conta</AlertDialogDescription>
        </AlertDialogHeader>
        <p>
          Ao confirmar, você apagará a conta permanentemente, sem ter a
          possibilidade de desfazer a ação. Deseja confirmar?
        </p>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Clients;
