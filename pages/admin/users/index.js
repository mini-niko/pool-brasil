// ShadCN
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Controller, useForm } from "react-hook-form";
import FormField from "@/components/ui/form-field";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Form from "@/components/ui/Form";

import { cpf as cpfValidator } from "cpf-cnpj-validator";
import useUser from "@/interface/hooks/useUser";

const adminCreateUserSchema = z
  .object({
    name: z
      .string()
      .min(3, "O nome deve ter mais de 3 letras.")
      .regex(
        /^[A-Za-zÀ-ÿ]+(?:[-'\s][A-Za-zÀ-ÿ]+)*$/,
        "O nome deve conter apenas letras e espaços.",
      ),
    cpf: z.string().refine((cpf) => cpfValidator.isValid(cpf), {
      message: "O CPF deve ser válido.",
    }),
    email: z.string().email("O email deve ser válido."),
    birth_day: z
      .string()
      .refine((val) => {
        const date = new Date(val);
        return !isNaN(date?.getTime());
      }, "A data de nascimento é obrigatória")
      .refine((val) => {
        const today = new Date();
        const minAge = new Date(
          today.getFullYear() - 16,
          today.getMonth(),
          today.getDate(),
        );
        return new Date(val) <= minAge;
      }, "O usuário deve ter, pelo menos, 16 anos."),
    features: z.enum(["client", "professional", "admin"]),
    password: z.string().min(8, "A senha deve ter, no mínimo, 8 caracteres"),
    confirm_password: z.string(),
    address: z.object({
      street: z
        .string()
        .regex(/^[\p{L}0-9 ]+$/u, "A rua deve conter apenas letras e números.")
        .min(8, "A rua deve conter, pelo menos, 8 letras."),
      number: z.coerce
        .number({
          required_error: "O número é obrigatório",
          invalid_type_error: "O numero deve ser válido",
        })
        .int("O número deve ser válido.")
        .min(1, "O número deve ser válido.")
        .max(999999, "O número deve ser válido."),
      complement: z
        .string()
        .min(0)
        .max(40, "O complemento deve ser mais curto."),
      reference: z.string().min(0).max(40, "A referência deve ser mais curta."),
      state: z.string().min(1, "O estado é obrigatório."),
      city: z.string().min(1, "A cidade é obrigatório."),
    }),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirm_password) {
      ctx.addIssue({
        path: ["confirm_password"],
        code: z.ZodIssueCode.custom,
        message: "As senhas precisam ser iguais",
      });
    }
  });

const adminUpdateUserSchema = z.object({
  name: z
    .string()
    .refine((val) => !val || val.length >= 3, {
      message: "O nome deve ter mais de 3 letras.",
    })
    .refine(
      (val) => !val || /^[A-Za-zÀ-ÿ]+(?:[-'\s][A-Za-zÀ-ÿ]+)*$/.test(val),
      "O nome deve conter apenas letras e espaços.",
    )
    .optional(),
  cpf: z
    .string()
    .optional()
    .refine(
      (cpf) => !cpf || cpfValidator.isValid(cpf),
      "O CPF deve ser válido.",
    ),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.string().email().safeParse(val).success,
      "O email deve ser válido.",
    ),
  birth_day: z.string().refine((val) => {
    const today = new Date();
    const minAge = new Date(
      today.getFullYear() - 16,
      today.getMonth(),
      today.getDate(),
    );
    return !val || new Date(val) <= minAge;
  }, "O usuário deve ter, pelo menos, 16 anos."),
  features: z
    .string()
    .refine(
      (val) =>
        !val ||
        z.enum(["client", "professional", "admin"]).safeParse(val).success,
      "Selecione um tipo válido.",
    ),
  password: z
    .string()
    .refine(
      (val) => !val || val.length >= 8,
      "A senha deve ter, no mínimo, 8 caracteres.",
    ),
  address: z.object({
    street: z
      .string()
      .refine(
        (val) => !val || /^[\p{L}0-9 ]+$/u.test(val),
        "A rua deve conter apenas letras e números.",
      )
      .refine(
        (val) => !val || val >= 8,
        "A rua deve conter, pelo menos, 8 letras.",
      ),
    number: z
      .string()
      .transform((val) => (val ? Number.parseInt(val) : ""))
      .refine(
        (val) =>
          val === "" || (Number.isInteger(val) && val > 0 && val < 99999),
        "O número precisa ser válido.",
      )
      .optional(),
    complement: z.string().min(0).max(40, "O complemento deve ser mais curto."),
    reference: z.string().min(0).max(40, "A referência deve ser mais curta."),
    state: z.string(),
    city: z.string(),
  }),
});

function Clients() {
  const { isLoading, data: rawData } = useSWR("/api/v1/users", fetcher);

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
        {isLoading ? (
          <Skeleton className="h-96  w-full md:w-4/5" />
        ) : (
          <>
            <div className="gap-4 flex flex-col-reverse md:flex-row items-center justify-between w-full md:w-3/4">
              <SearchItems rawData={rawData} setData={setData} />
              <CreateAccountDialog>
                <Button className="w-fit" variant="outline">
                  <CirclePlus className="h-8, w-8" /> Criar nova conta
                </Button>
              </CreateAccountDialog>
            </div>
            <ClientsTable data={data} />
          </>
        )}
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
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminCreateUserSchema),
    mode: "onChange",
  });

  const [isOpen, setIsOpen] = useState(false);
  const state = watch("address.state");

  const features = {
    client: "Cliente",
    professional: "Profissional",
    admin: "Administrador",
  };

  const { data: states } = useSWR(
    "https://brasilapi.com.br/api/ibge/uf/v1",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    },
  );

  const { data: cities } = useSWR(
    state
      ? `https://brasilapi.com.br/api/ibge/municipios/v1/${watch("address.state")}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    },
  );

  async function onSubmit(data) {
    data = {
      ...data,
      features: [data.features],
    };

    const response = await fetch("/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 201) {
      mutate("/api/v1/users");
      setIsOpen(false);
    }
  }

  const steps = [
    [
      <FormField
        key="name"
        id="name"
        label="Nome Completo"
        placeholder="Fulano da Silva"
        error={errors.name}
        register={register}
      />,
      <FormField
        key="cpf"
        id="cpf"
        label="CPF"
        placeholder="012.345.678-90"
        error={errors.cpf}
        register={register}
      />,
      <FormField
        key="email"
        id="email"
        label="Email"
        placeholder="exemplo@email.com"
        error={errors.email}
        register={register}
      />,
      <FormField
        key="birth_day"
        className="w-fit"
        id="birth_day"
        type="date"
        label="Data de nascimento"
        error={errors.birth_day}
        register={register}
      />,
    ],
    [
      <FormField
        key="street"
        id="street"
        prefix="address"
        label="Rua"
        error={errors.address?.street}
        register={register}
        placeholder="Rua dos Santos"
      />,
      <FormField
        key="number"
        id="number"
        prefix="address"
        label="Número"
        error={errors.address?.number}
        register={register}
        placeholder="1029"
      />,
      <FormField
        key="complement"
        id="complement"
        prefix="address"
        label="Complemento (opcional)"
        error={errors.address?.complement}
        register={register}
        placeholder="Apartamento 101"
      />,
      <>
        {/* Estado e cidade */}
        <div key="location" className="flex gap-4">
          <div className="flex flex-col gap-1 w-32">
            <Label htmlFor="state">Estado</Label>
            <Controller
              name="address.state"
              control={control}
              rules={{ required: "Estado é obrigatório" }}
              defaultValue=""
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    className={
                      "w-full" +
                      (errors.address?.state ? ` border-red-400` : "")
                    }
                  >
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Estados</SelectLabel>
                      {states &&
                        states.map((sail) => (
                          <SelectItem key={sail.id} value={sail.sigla}>
                            {sail.sigla}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.address?.state && (
              <p className="text-xs text-red-600">
                {errors.address?.state.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 w-full">
            <Label htmlFor="city">Cidade</Label>
            <Controller
              name="address.city"
              control={control}
              rules={{ required: "Cidade é obrigatória" }}
              defaultValue=""
              render={({ field }) => (
                <Select
                  id="city"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    className={
                      "w-full" + (errors.address?.city ? ` border-red-400` : "")
                    }
                  >
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Cidades</SelectLabel>
                      {cities &&
                        cities.map((city) => (
                          <SelectItem key={city.nome} value={city.nome}>
                            {city.nome}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.address?.city && (
              <p className="text-xs text-red-600">
                {errors.address?.city.message}
              </p>
            )}
          </div>
        </div>
      </>,
      <FormField
        key="reference"
        id="reference"
        prefix="address"
        label="Referência (opcional)"
        error={errors.address?.reference}
        register={register}
        placeholder="Ao lado da loja XYZ"
      />,
    ],
    [
      <>
        <div key="features" className="flex flex-col gap-1 w-full">
          <Label htmlFor="features">Tipo</Label>
          <Controller
            name="features"
            control={control}
            rules={{ required: "O Tipo é obrigatório" }}
            defaultValue=""
            render={({ field }) => (
              <Select
                id="feature"
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger
                  className={
                    "w-full" + (errors.features ? ` border-red-400` : "")
                  }
                >
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(features).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.features && (
            <p className="text-xs text-red-600">{errors.features.message}</p>
          )}
        </div>
      </>,
      <FormField
        key="password"
        id="password"
        label="Senha"
        type="password"
        error={errors.password}
        register={register}
      />,
      <FormField
        key="confirm_password"
        id="confirm_password"
        label="Senha"
        type="password"
        error={errors.confirm_password}
        register={register}
      />,
    ],
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar nova conta</DialogTitle>
          <DialogDescription>
            Adicione os dados abaixo para criar uma nova conta.
          </DialogDescription>
        </DialogHeader>
        <Form steps={steps} error={errors} onSubmit={handleSubmit(onSubmit)} />
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
  const { isLoading, user } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="fit">
          <EllipsisVertical className="w-8 h-8" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <UserDetails data={data} />
        <UserUpdate id={data.id} />
        {!isLoading && user?.id != data.id ? (
          <UserDelete id={data.id} />
        ) : (
          <></>
        )}
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

function UserUpdate({ id }) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminUpdateUserSchema),
    mode: "onChange",
  });

  const [isOpen, setIsOpen] = useState(false);
  const state = watch("address.state");

  const features = {
    client: "Cliente",
    professional: "Profissional",
    admin: "Administrador",
  };

  const { data: states } = useSWR(
    "https://brasilapi.com.br/api/ibge/uf/v1",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    },
  );

  const { data: cities } = useSWR(
    state
      ? `https://brasilapi.com.br/api/ibge/municipios/v1/${watch("address.state")}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    },
  );

  async function onSubmit(data) {
    data = {
      ...data,
      features: [data.features],
    };

    for (const key in data) {
      if (!data[key][0]) {
        delete data[key];
      }
    }

    const response = await fetch(`/api/v1/users?id=${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 200) {
      mutate("/api/v1/users");
      setIsOpen(false);
    }
  }

  const steps = [
    [
      <FormField
        key="name"
        id="name"
        label="Nome Completo"
        placeholder="Fulano da Silva"
        error={errors.name}
        register={register}
      />,
      <FormField
        key="cpf"
        id="cpf"
        label="CPF"
        placeholder="012.345.678-90"
        error={errors.cpf}
        register={register}
      />,
      <FormField
        key="email"
        id="email"
        label="Email"
        placeholder="exemplo@email.com"
        error={errors.email}
        register={register}
      />,
      <FormField
        key="birth_day"
        className="w-fit"
        id="birth_day"
        type="date"
        label="Data de nascimento"
        error={errors.birth_day}
        register={register}
      />,
    ],
    [
      <FormField
        key="street"
        id="street"
        prefix="address"
        label="Rua"
        error={errors.address?.street}
        register={register}
        placeholder="Rua dos Santos"
      />,
      <FormField
        key="number"
        id="number"
        prefix="address"
        label="Número"
        error={errors.address?.number}
        register={register}
        placeholder="1029"
      />,
      <FormField
        key="complement"
        id="complement"
        prefix="address"
        label="Complemento (opcional)"
        error={errors.address?.complement}
        register={register}
        placeholder="Apartamento 101"
      />,
      <div key="state-city-row" className="flex gap-4">
        <div key="state" className="flex flex-col gap-1 w-32">
          <Label htmlFor="state">Estado</Label>
          <Controller
            name="address.state"
            control={control}
            rules={{ required: "Estado é obrigatório" }}
            defaultValue=""
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger
                  className={
                    "w-full" + (errors.address?.state ? ` border-red-400` : "")
                  }
                >
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Estados</SelectLabel>
                    {states &&
                      states.map((sail) => (
                        <SelectItem key={sail.id} value={sail.sigla}>
                          {sail.sigla}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.address?.state && (
            <p className="text-xs text-red-600">
              {errors.address?.state.message}
            </p>
          )}
        </div>
        <div key="city" className="flex flex-col gap-1 w-full">
          <Label htmlFor="city">Cidade</Label>
          <Controller
            name="address.city"
            control={control}
            rules={{ required: "Cidade é obrigatória" }}
            defaultValue=""
            render={({ field }) => (
              <Select
                id="city"
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger
                  className={
                    "w-full" + (errors.address?.city ? ` border-red-400` : "")
                  }
                >
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cidades</SelectLabel>
                    {cities &&
                      cities.map((city) => (
                        <SelectItem key={city.nome} value={city.nome}>
                          {city.nome}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.address?.city && (
            <p className="text-xs text-red-600">
              {errors.address?.city.message}
            </p>
          )}
        </div>
      </div>,
      <FormField
        key="reference"
        id="reference"
        prefix="address"
        label="Referência (opcional)"
        error={errors.address?.reference}
        register={register}
        placeholder="Ao lado da loja XYZ"
      />,
    ],
    [
      <div key="features" className="flex flex-col gap-1 w-full">
        <Label htmlFor="features">Tipo</Label>
        <Controller
          name="features"
          control={control}
          rules={{ required: "O Tipo é obrigatório" }}
          defaultValue=""
          render={({ field }) => (
            <Select
              id="feature"
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger
                className={
                  "w-full" + (errors.features ? ` border-red-400` : "")
                }
              >
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(features).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.features && (
          <p className="text-xs text-red-600">{errors.features.message}</p>
        )}
      </div>,
      <FormField
        key="password"
        id="password"
        label="Senha"
        type="password"
        error={errors.password}
        register={register}
      />,
    ],
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem>Atualizar</DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar conta</DialogTitle>
          <DialogDescription>
            Insira os dados para alterar. Caso não queira alterar, deixe em
            branco.
          </DialogDescription>
        </DialogHeader>
        <Form steps={steps} error={errors} onSubmit={handleSubmit(onSubmit)} />
      </DialogContent>
    </Dialog>
  );
}

function UserDelete({ id }) {
  const [isOpen, setIsOpen] = useState(false);

  async function onSubmit() {
    const response = await fetch(`/api/v1/users?id=${id}`, {
      method: "DELETE",
    });

    if (response.status !== 200) return;

    mutate("/api/v1/users");
    setIsOpen(false);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
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
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancelar</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={onSubmit}>Confirmar</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Clients;
