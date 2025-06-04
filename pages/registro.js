import { useRouter } from "next/router";
import DefaultContainer from "@/components/ui/defaultContainer";
import Form from "@/components/ui/Form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import {} from "@radix-ui/react-select";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/ui/form-field";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Fragment } from "react";

const registerUserSchema = z
  .object({
    name: z
      .string()
      .min(3, "Seu nome deve ter mais de 3 letras.")
      .regex(
        /^[A-Za-zÀ-ÿ]+(?:[-'\s][A-Za-zÀ-ÿ]+)*$/,
        "Seu nome deve conter apenas letras e espaços.",
      ),
    cpf: z.string().refine((cpf) => cpfValidator.isValid(cpf), {
      message: "Seu CPF deve ser válido.",
    }),
    email: z.string().email("Seu email deve ser válido."),
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
      }, "Você deve ter, pelo menos, 16 anos."),
    password: z.string().min(8, "Sua senha deve ter, no mínimo, 8 caracteres"),
    confirm_password: z.string(),
    address: z.object({
      street: z
        .string()
        .nonempty("A sua rua deve ser inserida.")
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
        .min(0, "Teste")
        .max(40, "O complemento deve ser mais curto."),
      reference: z
        .string()
        .min(0, "Teste")
        .max(40, "A referência deve ser mais curta."),
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

function Registro() {
  return (
    <DefaultContainer>
      <RegisterForm></RegisterForm>
    </DefaultContainer>
  );
}

function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerUserSchema),
    mode: "onBlur",
  });

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
    watch("address.state")
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
    const user = {
      ...data,
      birth_day: new Date(data.birth_day).toISOString(),
    };

    const response = await fetch("/api/v1/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (response.status == 201) router.push("/confirmar_conta");
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
      <Fragment key="state">
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
                <SelectValue placeholder="Selecione um estado" />
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
      </Fragment>,
      <Fragment key="city">
        <Label htmlFor="city">Cidade</Label>
        <Controller
          name="address.city"
          control={control}
          rules={{ required: "Estado é obrigatório" }}
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
                <SelectValue placeholder="Selecione uma cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estados</SelectLabel>
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
          <p className="text-xs text-red-600">{errors.address?.city.message}</p>
        )}
      </Fragment>,
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

  const Footer = () => (
    <p className="w-full text-sm text-center">
      <span>Já possui uma conta? </span>
      <Link className="underline text-pool-black" href="/login">
        Entrar agora
      </Link>
    </p>
  );

  return (
    <Card className="z-20 relative">
      <CardHeader className="w-[350px]">
        <CardTitle>
          <h1>Cadastro</h1>
        </CardTitle>
        <CardDescription>
          <h2>Preencha os dados abaixo para se cadastrar.</h2>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form steps={steps} error={errors} onSubmit={handleSubmit(onSubmit)} />
      </CardContent>
      <CardFooter>
        <Footer />
      </CardFooter>
    </Card>
  );
}

export default Registro;
