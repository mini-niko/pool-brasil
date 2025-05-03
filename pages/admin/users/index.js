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
import { useState } from "react";

// Ícones
import { CirclePlus, EllipsisVertical, Filter, Search } from "lucide-react";

function Clients() {
  const rawData = [
    {
      name: "José da Silva",
      email: "jose.silva@gmail.com",
      cpf: "12345678900",
      birth_day: "1990-02-15T00:00:00Z",
      created_at: "2025-04-10T19:23:00Z",
      updated_at: "2025-04-10T19:23:00Z",
      features: ["professional"],
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
      name: "Maria Oliveira",
      email: "maria.oliveira@yahoo.com",
      cpf: "23456789011",
      birth_day: "1987-07-23T00:00:00Z",
      created_at: "2025-04-11T08:15:00Z",
      updated_at: "2025-04-11T08:15:00Z",
      features: ["professional"],
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Avenida Brasil",
        number: 450,
        complement: null,
        reference: "Em frente à praça principal",
      },
    },
    {
      name: "Carlos Souza",
      email: "carlos.souza@hotmail.com",
      cpf: "34567890122",
      birth_day: "1992-11-09T00:00:00Z",
      created_at: "2025-04-12T14:42:00Z",
      updated_at: "2025-04-12T14:42:00Z",
      features: ["professional"],
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Rua Anita Garibaldi",
        number: 230,
        complement: "Casa",
        reference: "Perto da escola estadual",
      },
    },
    {
      name: "Ana Paula Costa",
      email: "ana.paula@gmail.com",
      cpf: "45678901233",
      birth_day: "1995-03-01T00:00:00Z",
      created_at: "2025-04-13T16:30:00Z",
      updated_at: "2025-04-13T16:30:00Z",
      features: ["professional"],
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Rua Victor Konder",
        number: 89,
        complement: null,
        reference: "Ao lado da farmácia São João",
      },
    },
    {
      name: "Fernando Lima",
      email: "fernando.lima@outlook.com",
      cpf: "56789012344",
      birth_day: "1989-05-17T00:00:00Z",
      created_at: "2025-04-13T10:05:00Z",
      updated_at: "2025-04-13T10:05:00Z",
      features: ["professional"],
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Rua Olavo Bilac",
        number: 152,
        complement: "Fundos",
        reference: "Atrás da padaria Pão Quente",
      },
    },
    {
      name: "Juliana Martins",
      email: "juliana.martins@gmail.com",
      cpf: "67890123455",
      birth_day: "1993-08-29T00:00:00Z",
      created_at: "2025-04-14T09:20:00Z",
      updated_at: "2025-04-14T09:20:00Z",
      features: ["client"],
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Rua Rui Barbosa",
        number: 118,
        complement: "Sala 3",
        reference: "Próximo ao shopping center",
      },
    },
    {
      name: "Rafael Pereira",
      email: "rafael.pereira@uol.com.br",
      cpf: "78901234566",
      birth_day: "1991-12-10T00:00:00Z",
      created_at: "2025-04-14T18:00:00Z",
      updated_at: "2025-04-14T18:00:00Z",
      features: ["client"],
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Rua Anita Garibaldi",
        number: 320,
        complement: null,
        reference: "Atrás da academia Fitness Plus",
      },
    },
    {
      name: "Larissa Fernandes",
      email: "larissa.fernandes@gmail.com",
      cpf: "89012345677",
      birth_day: "1996-04-06T00:00:00Z",
      created_at: "2025-04-15T11:47:00Z",
      updated_at: "2025-04-15T11:47:00Z",
      features: ["client"],
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Rua Victor Konder",
        number: 75,
        complement: "Cobertura",
        reference: "Em cima da pizzaria Don Juan",
      },
    },
    {
      name: "Bruno Rocha",
      email: "bruno.rocha@icloud.com",
      cpf: "90123456788",
      birth_day: "1990-06-18T00:00:00Z",
      created_at: "2025-04-15T15:35:00Z",
      updated_at: "2025-04-15T15:35:00Z",
      features: ["client"],
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Avenida Brasil",
        number: 580,
        complement: "Loja 2",
        reference: "Ao lado da loja Americanas",
      },
    },
    {
      name: "Camila Ribeiro",
      email: "camila.ribeiro@gmail.com",
      cpf: "01234567899",
      birth_day: "1994-01-22T00:00:00Z",
      created_at: "2025-04-16T13:12:00Z",
      updated_at: "2025-04-16T13:12:00Z",
      features: ["client"],
      address: {
        state: "SC",
        city: "Xanxerê",
        street: "Rua Olavo Bilac",
        number: 240,
        complement: null,
        reference: "Em frente ao colégio São Francisco",
      },
    },
  ];

  const [data, setData] = useState(rawData);

  return (
    <>
      <NavigationBar />
      <Container className="gap-4">
        <div className="text-center text-pool-black">
          <h1 className="font-bold text-2xl">Usuários</h1>
          <h2 className="text-lg">Gerencie os usuários do seu sistema.</h2>
        </div>
        <div className="gap-4 flex flex-col-reverse md:flex-row items-center justify-between w-full md:w-3/4">
          <SearchItems rawData={rawData} setData={setData} />
          <CreateAccount />
        </div>
        <ClientsTable data={data} />
        <Link className="underline text-pool-black" href="/admin">
          Voltar à página principal
        </Link>
      </Container>
    </>
  );
}

function SearchItems({ rawData, setData }) {
  const [filter, setFilter] = useState("");
  const [filterKey, setFilterKey] = useState("name");

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
        <Search className="h-4 w-4" />
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
              onClick={() => setFilterKey("name")}
              variant={filterKey === "name" ? "default" : "outline"}
            >
              Nome
            </Button>
            <Button
              onClick={() => setFilterKey("cpf")}
              variant={filterKey === "cpf" ? "default" : "outline"}
            >
              CPF
            </Button>
            <Button
              onClick={() => setFilterKey("email")}
              variant={filterKey === "email" ? "default" : "outline"}
            >
              Email
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function CreateAccount() {
  return (
    <CreateAccountDialog>
      <Button className="w-fit" variant="outline">
        <CirclePlus className="h-8, w-8" /> Criar nova conta
      </Button>
    </CreateAccountDialog>
  );
}

function CreateAccountDialog({ children }) {
  const pages = [
    <div key="page-1" className="flex flex-col">
      <div className="flex flex-col gap-2 my-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          className="w-2/3 disabled:opacity-100 disabled:cursor-default"
          id="name"
        />
      </div>
      <div className="flex flex-col gap-2 my-2">
        <Label htmlFor="cpf">CPF</Label>
        <Input
          className="w-1/2 disabled:opacity-100 disabled:cursor-default"
          id="cpf"
        />
      </div>
      <div className="flex flex-col gap-2 my-2">
        <Label htmlFor="email">Email</Label>
        <Input
          className="w-2/3 disabled:opacity-100 disabled:cursor-default"
          id="email"
        />
      </div>
      <div className="flex flex-col gap-2 my-2">
        <Label htmlFor="birthday">Data de nascimento</Label>
        <Input
          className="w-fit disabled:opacity-100 disabled:cursor-default"
          id="birthday"
          type="date"
        />
      </div>
    </div>,

    <div key="page-2" className="flex flex-col">
      <div className="flex gap-4 items-stretch">
        <div className="flex w-5/6 flex-col gap-2 my-2">
          <Label htmlFor="street">Rua</Label>
          <Input
            className="w-full disabled:opacity-100 disabled:cursor-default"
            id="street"
          />
        </div>
        <div className="flex w-1/6 flex-col gap-2 my-2">
          <Label htmlFor="number">Número</Label>
          <Input
            className="w-full disabled:opacity-100 disabled:cursor-default"
            id="number"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex w-1/2 flex-col gap-2 my-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            className="w-full disabled:opacity-100 disabled:cursor-default"
            id="complement"
          />
        </div>
        <div className="flex w-1/2 flex-col gap-2 my-2">
          <Label htmlFor="reference">Referência</Label>
          <Input
            className="w-full disabled:opacity-100 disabled:cursor-default"
            id="reference"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex w-1/6 flex-col gap-2 my-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            className="w-full disabled:opacity-100 disabled:cursor-default"
            id="state"
          />
        </div>
        <div className="flex w-1/2 flex-col gap-2 my-2">
          <Label htmlFor="cities">Cidade</Label>
          <Input
            className="w-full disabled:opacity-100 disabled:cursor-default"
            id="cities"
          />
        </div>
      </div>
    </div>,

    <div key="page-3" className="flex flex-col">
      <div className="flex w-2/3 flex-col gap-2 my-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          className="w-full disabled:opacity-100 disabled:cursor-default"
          id="password"
        />
      </div>
      <div className="flex w-2/3 flex-col gap-2 my-2">
        <Label htmlFor="password">Confirmar senha</Label>
        <Input
          className="w-full disabled:opacity-100 disabled:cursor-default"
          id="password"
        />
      </div>
    </div>,
  ];

  const [numberPage, setNumberPage] = useState(0);

  function onClickConfirm(e) {
    if (numberPage < pages.length - 1) {
      e.preventDefault();
      setNumberPage(numberPage + 1);
    } else {
      setTimeout(() => {
        setNumberPage(0);
      }, 150);
      //post na api
    }
  }

  function onClickCancel(e) {
    if (numberPage > 0) {
      e.preventDefault();
      setNumberPage(numberPage - 1);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar nova conta</DialogTitle>
          <DialogDescription>
            Adicione os dados abaixo para criar uma nova conta.
          </DialogDescription>
        </DialogHeader>
        {pages[numberPage]}
        <DialogFooter className="flex-row justify-end">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClickCancel}>
              {numberPage > 0 ? "Voltar" : "Cancelar"}
            </Button>
          </DialogClose>
          <DialogClose>
            <Button onClick={onClickConfirm}>
              {numberPage < pages.length - 1 ? "Próximo" : "Confirmar"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ClientsTable({ data }) {
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
        {data.map((user) => {
          return (
            <TableRow key={user.id} className="justify-center">
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.cpf}</TableCell>
              <TableCell className="hidden md:table-cell">
                {user.email}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(user.birth_day).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell>
                <UserOptions data={user} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function UserOptions({ data }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="fit">
          <EllipsisVertical className="w-8 h-8" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <UserDetails data={data} />
        <UserUpdate />
        <UserDelete />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserDetails({ data }) {
  const featureLabels = {
    client: "Cliente",
    professional: "Profissonal",
    admin: "Administrador",
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem>Detalhes</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes do usuário</DialogTitle>
          <DialogDescription>
            Veja com mais detalhes os dados do usuário.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="account" className="w-full gap-4">
          <TabsList className="self-center">
            <TabsTrigger value="account">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="adress">Endereço</TabsTrigger>
            <TabsTrigger value="other">Outros</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <div className="flex flex-col w-full">
              <div className="flex gap-4 my-2 w-full">
                <Label htmlFor="name" className="w-1/3 justify-end">
                  Nome
                </Label>
                <Input
                  className="w-2/3 disabled:opacity-100 disabled:cursor-default"
                  id="name"
                  disabled
                  value={data.name}
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
                  value={data.cpf}
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
                  value={data.email}
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
                    value={new Date(data.birth_day)
                      .toLocaleDateString("pt-BR")
                      .split("/")
                      .reverse()
                      .join("-")}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="adress">
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
                    value={data.address.street}
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
                      value={data.address.number}
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
                      value={data.address.complement}
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
                      value={data.address.state}
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
                      value={data.address.city}
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
                    Data de criação
                  </Label>
                  <Input
                    className="w-3/5 md:w-1/2 disabled:opacity-100 disabled:cursor-default"
                    id="street"
                    disabled
                    value={new Date(data.created_at).toLocaleString("pt-BR")}
                  />
                </div>

                <div className="flex flex-row justify-center gap-4 my-2">
                  <Label
                    className="w-1/3 justify-end text-end"
                    htmlFor="number"
                  >
                    Última atualização
                  </Label>
                  <Input
                    className="w-3/5 md:w-1/2 disabled:opacity-100 disabled:cursor-default"
                    id="street"
                    disabled
                    value={new Date(data.updated_at).toLocaleString("pt-BR")}
                  />
                </div>
                <div className="flex flex-row justify-center gap-4 my-2">
                  <Label className="w-1/3 justify-end" htmlFor="number">
                    Tipo de conta
                  </Label>
                  <Input
                    className="w-3/5 disabled:opacity-100 disabled:cursor-default"
                    id="street"
                    disabled
                    value={featureLabels[data.features[0]]}
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

function UserUpdate() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem>Atualizar</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar usuário</DialogTitle>
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
                <Label htmlFor="name">Nome</Label>
                <Input
                  className="w-2/3 disabled:opacity-100 disabled:cursor-default"
                  id="name"
                />
              </div>
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  className="w-1/2 disabled:opacity-100 disabled:cursor-default"
                  id="cpf"
                />
              </div>
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="w-2/3 disabled:opacity-100 disabled:cursor-default"
                  id="email"
                />
              </div>
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="birthday">Data de nascimento</Label>
                <Input
                  className="w-fit disabled:opacity-100 disabled:cursor-default"
                  id="birthday"
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
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    className="w-full disabled:opacity-100 disabled:cursor-default"
                    id="complement"
                  />
                </div>
                <div className="flex w-1/2 flex-col gap-2 my-2">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    className="w-full disabled:opacity-100 disabled:cursor-default"
                    id="number"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex w-1/6 flex-col gap-2 my-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    className="w-full disabled:opacity-100 disabled:cursor-default"
                    id="state"
                  />
                </div>
                <div className="flex w-1/2 flex-col gap-2 my-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    className="w-full disabled:opacity-100 disabled:cursor-default"
                    id="city"
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

function UserDelete() {
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
          Ao confirmar, você apagará a conta permanentemente, sem ter a
          possibilidade de desfazer a ação. Deseja confirmar?
        </p>
        <AlertDialogFooter className="mt-2 flex-row justify-end">
          <AlertDialogAction>
            <Button>Cancelar</Button>
          </AlertDialogAction>
          <AlertDialogCancel asChild>
            <Button variant="outline">Confirmar</Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Clients;
