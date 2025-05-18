import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import DefaultContainer from "@/components/ui/defaultContainer";
import Form from "@/components/ui/Form";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

function Registro() {
  const router = useRouter();

  const [pageIndex, setPageIndex] = useState(0);

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [birthDay, setBirthDay] = useState("");

  const [street, setStreet] = useState("");
  const [number, setNumber] = useState();
  const [complement, setComplement] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [reference, setReference] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    async function fetchStates() {
      const statesResponse = await fetch(
        "https://brasilapi.com.br/api/ibge/uf/v1",
      );

      const statesBody = await statesResponse.json();

      const statesArray = statesBody
        .map((state) => {
          return state.sigla;
        })
        .sort((a, b) => a.localeCompare(b));

      setStates(statesArray);
    }

    fetchStates();
  }, []);

  useEffect(() => {
    if (!state) return;
    async function fetchCities() {
      const citiesResponse = await fetch(
        `https://brasilapi.com.br/api/ibge/municipios/v1/${state}`,
      );

      const citiesBody = await citiesResponse.json();

      const citiesArray = citiesBody
        .map((city) => {
          return city.nome;
        })
        .sort((a, b) => a.localeCompare(b));

      setCities(citiesArray);
    }

    fetchCities();
  }, [state]);

  async function onSubmit() {
    const isoBirthDay = new Date(birthDay || 0).toISOString();

    const user = {
      name,
      cpf,
      email,
      password,
      confirm_password: confirmPassword,
      birth_day: isoBirthDay,
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

    if (response.status == 201) router.push("/confirmar_conta");
  }

  const pages = [
    <>
      <Card className="items-center z-20 relative">
        <CardHeader className="w-[350px]">
          <CardTitle>
            <h1>Registro</h1>
          </CardTitle>
          <CardDescription>
            <h2>Vamos iniciar seu registro?</h2>
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col gap-4">
          <Button onClick={() => setPageIndex(1)}>Iniciar</Button>
          <p className="text-sm">
            <span>Já possui uma conta? </span>
            <Link className="underline text-pool-black" href="/login">
              Entrar agora
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>,
    <>
      <Form
        title="Dados Pessoais"
        subtitle="Preencha os campos abaixo com os seus dados para iniciar o cadastro."
        buttonLabel={"Próximo"}
        fields={[
          <>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Fulano da Silva"
            />
          </>,
          <>
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="012.345.678-90"
            />
          </>,
          <>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
            />
          </>,
          <>
            <Label htmlFor="birthday">Data de Nascimento</Label>
            <Input
              className="w-fit"
              id="birthday"
              type="date"
              onChange={(e) => setBirthDay(e.target.value)}
            />
          </>,
        ]}
        onBack={() => setPageIndex(0)}
        onClick={() => setPageIndex(2)}
        footer={
          <p className="text-sm">
            <span>Já possui uma conta? </span>
            <Link className="underline text-pool-black" href="/login">
              Entrar agora
            </Link>
          </p>
        }
      />
    </>,
    <>
      <Form
        title="Endereço"
        subtitle="Adicione o seu endereço para futuros serviços (endereço do local da
          piscina)"
        buttonLabel={"Próximo"}
        fields={[
          <>
            <Label htmlFor="street">Rua</Label>
            <Input
              id="street"
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Rua XYZ"
            />
          </>,
          <>
            <Label htmlFor="number">Número</Label>
            <Input
              id="number"
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="0"
            />
          </>,
          <>
            <Label htmlFor="complement">Complemento (opcional)</Label>
            <Input
              id="complement"
              type="text"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
              placeholder="Apartamento 0"
            />
          </>,
          <>
            <Label htmlFor="state">Estado</Label>
            <Select id="state" value={state} onValueChange={setState}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estados</SelectLabel>
                  {states.map((sail) => {
                    return (
                      <SelectItem key={sail} value={sail}>
                        {sail}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </>,
          <>
            <Label htmlFor="city">Cidade</Label>
            <Select id="city" value={city} onValueChange={setCity}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Cidade</SelectLabel>
                  {cities.map((name) => {
                    return (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </>,
          <>
            <Label htmlFor="reference">Referência</Label>
            <Input
              id="reference"
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder=""
            />
          </>,
        ]}
        onBack={() => setPageIndex(1)}
        onClick={() => setPageIndex(3)}
        footer={
          <p className="text-sm">
            <span>Já possui uma conta? </span>
            <Link className="underline text-pool-black" href="/login">
              Entrar agora
            </Link>
          </p>
        }
      />
    </>,
    <>
      <Form
        title="Senha"
        subtitle="
          Crie a sua nova senha."
        buttonLabel="Próximo"
        fields={[
          <>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
            />
          </>,
          <>
            <Label htmlFor="confirmPassword">Repita a senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita sua senha"
            />
          </>,
        ]}
        onSubmit={(e) => e.preventDefault()}
        onBack={() => setPageIndex(2)}
        onClick={onSubmit}
      ></Form>
    </>,
  ];

  return <DefaultContainer>{pages[pageIndex]}</DefaultContainer>;
}

export default Registro;
