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
import {
  CirclePlus,
  EllipsisVertical,
  Filter,
  RefreshCw,
  Search,
} from "lucide-react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";

function Clients() {
  const { data: rawData } = useSWR("/api/v1/users", fetcher);

  const [data, setData] = useState(rawData);

  useEffect(() => {
    setData(rawData);
  }, [rawData]);

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

          <CreateAccountDialog>
            <Button className="w-fit" variant="outline">
              <CirclePlus className="h-8, w-8" /> Criar nova conta
            </Button>
          </CreateAccountDialog>
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

function CreateAccountDialog({ children }) {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feature, setFeature] = useState("client");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDay, setBirthDay] = useState("");

  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [reference, setReference] = useState("");

  const features = {
    client: "Cliente",
    professional: "Profissional",
    Admin: "Administrador",
  };

  const pages = [
    <div key="page-1" className="flex flex-col">
      <div className="flex flex-col gap-2 my-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-2/3 disabled:opacity-100 disabled:cursor-default"
          id="name"
        />
      </div>
      <div className="flex flex-col gap-2 my-2">
        <Label htmlFor="cpf">CPF</Label>
        <Input
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          className="w-1/2 disabled:opacity-100 disabled:cursor-default"
          id="cpf"
        />
      </div>
      <div className="flex flex-col gap-2 my-2">
        <Label htmlFor="email">Email</Label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-2/3 disabled:opacity-100 disabled:cursor-default"
          id="email"
        />
      </div>
      <div className="flex flex-col gap-2 my-2">
        <Label htmlFor="birthday">Data de nascimento</Label>
        <Input
          value={birthDay}
          onChange={(e) => setBirthDay(e.target.value)}
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
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full disabled:opacity-100 disabled:cursor-default"
            id="street"
          />
        </div>
        <div className="flex w-1/6 flex-col gap-2 my-2">
          <Label htmlFor="number">Número</Label>
          <Input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full disabled:opacity-100 disabled:cursor-default"
            id="number"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex w-1/2 flex-col gap-2 my-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            value={complement}
            onChange={(e) => setComplement(e.target.value)}
            className="w-full disabled:opacity-100 disabled:cursor-default"
            id="complement"
          />
        </div>
        <div className="flex w-1/2 flex-col gap-2 my-2">
          <Label htmlFor="reference">Referência</Label>
          <Input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full disabled:opacity-100 disabled:cursor-default"
            id="reference"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex w-2/6 flex-col gap-2 my-2">
          <Label htmlFor="state">Estado (UF)</Label>
          <Input
            value={state}
            maxLength={2}
            onChange={(e) => setState(e.target.value)}
            className="w-full disabled:opacity-100 disabled:cursor-default"
            id="state"
          />
        </div>
        <div className="flex w-1/2 flex-col gap-2 my-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full disabled:opacity-100 disabled:cursor-default"
            id="city"
          />
        </div>
      </div>
    </div>,

    <div key="page-3" className="flex flex-col">
      <div className="flex w-2/3 flex-col gap-2 my-2">
        <Label htmlFor="password">Tipo</Label>
        <Select value={feature} onValueChange={(value) => setFeature(value)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {
              <SelectGroup>
                {Object.entries(features).map(([key, value]) => {
                  return (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            }
          </SelectContent>
        </Select>
      </div>
      <div className="flex w-2/3 flex-col gap-2 my-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="w-full disabled:opacity-100 disabled:cursor-default"
          id="password"
        />
      </div>
      <div className="flex w-2/3 flex-col gap-2 my-2">
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <Input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          className="w-full disabled:opacity-100 disabled:cursor-default"
          id="confirmPassword"
        />
      </div>
    </div>,
  ];

  const [numberPage, setNumberPage] = useState(0);

  async function onClickConfirm(e) {
    if (numberPage < pages.length - 1) {
      e.preventDefault();
      setNumberPage(numberPage + 1);
    } else {
      const user = {
        name,
        cpf,
        email,
        password,
        features: [feature],
        confirm_password: confirmPassword,
        birth_day: birthDay,
        address: {
          state,
          city,
          street,
          number,
          complement,
          reference,
        },
      };

      const response = await fetch("/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.status === 201) {
        mutate("/api/v1/users");
      }
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
        {data &&
          data?.map((user) => {
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
                <Label htmlFor="name" className="w-1/4 justify-end">
                  Nome
                </Label>
                <Input
                  className="w-3/4 disabled:opacity-100 disabled:cursor-default"
                  id="name"
                  disabled
                  value={data.name}
                />
              </div>
              <div className="flex gap-4 my-2 w-full">
                <Label htmlFor="cpf" className="w-1/4 justify-end">
                  CPF
                </Label>
                <Input
                  className="w-3/4 disabled:opacity-100 disabled:cursor-default"
                  id="cpf"
                  disabled
                  value={data.cpf}
                />
              </div>
              <div className="flex gap-4 my-2 w-full">
                <Label htmlFor="email" className="w-1/12 justify-end">
                  Email
                </Label>
                <Input
                  className="w-11/12 disabled:opacity-100 disabled:cursor-default"
                  id="email"
                  disabled
                  value={data.email}
                />
              </div>
              <div className="flex gap-4 my-2 w-full">
                <Label
                  htmlFor="birthday"
                  className="w-1/4 justify-end text-end"
                >
                  Data de nascimento
                </Label>
                <div className="w-3/4">
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
                  <Textarea
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
                    <Textarea
                      className="md:w-2/3 disabled:opacity-100 disabled:cursor-default"
                      id="complement"
                      disabled
                      value={data.address.complement}
                    />
                  </div>
                </div>

                <div className="flex flex-row gap-4 my-2">
                  <Label className="w-1/3 justify-end" htmlFor="state">
                    Estado (UF)
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
                    className="w-3/5 md:w-1/2 disabled:opacity-100 disabled:cursor-default"
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
                  className="w-3/3 disabled:opacity-100 disabled:cursor-default"
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
                  <Label htmlFor="state">Estado (UF)</Label>
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
