import { useEffect, useState } from "react";
import Box from "./interface/components/Box";
import { useRouter } from "next/router";
import Link from "next/link";
import Button from "./interface/components/Button";
import TitleSubtitle from "./interface/components/TitleSubtitle";
import DefaultContainer from "./interface/components/DefaultContainer";
import Form from "./interface/components/Form";
import Input from "./interface/components/Input";
import Select from "./interface/components/Select";

function Registro() {
  const router = useRouter();

  const [pageIndex, setPageIndex] = useState(3);

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [birthDay, setBirthDay] = useState();

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

  const pages = [
    <>
      <Box
        box={true}
        flex={true}
        direction="col"
        items="center"
        justify="center"
        gap={4}
        color={"white"}
        className="w-fit px-8 py-24 md:px-12 gap-4 z-20 flex-1 items-center"
      >
        <TitleSubtitle
          title={"Registro"}
          subtitle={"Vamos iniciar seu registro?"}
        />
        <Button color={"dark"} onClick={() => setPageIndex(1)}>
          Iniciar
        </Button>
        <p className="md:text-sm">
          <span className="text-pool-dark">Já possui uma conta? </span>
          <Link className="underline" href="/login">
            Entrar agora
          </Link>
        </p>
      </Box>
    </>,
    <>
      <Form
        title={
          <TitleSubtitle
            title="Dados Pessoais"
            subtitle="
            Preencha os campos abaixo com os seus dados para iniciar o cadastro."
          />
        }
        buttonLabel={"Próximo"}
        fields={
          <>
            <Input
              label="Nome"
              name="name"
              type="text"
              value={name}
              setValue={setName}
              placeholder="Fulano da Silva"
            />
            <Input
              label="CPF"
              name="cpf"
              type="text"
              value={cpf}
              setValue={setCpf}
              placeholder="012.345.678-90"
            />
            <Input
              label="Email"
              name="email"
              value={email}
              setValue={setEmail}
              placeholder="exemplo@email.com"
            />
            <Input
              label="Data de Nascimento"
              type="date"
              name="birthday"
              value={birthDay}
              setValue={setBirthDay}
              placeholder="exemplo@email.com"
            />
          </>
        }
        onSubmit={(e) => e.preventDefault()}
        onBack={() => setPageIndex(0)}
        onClick={() => setPageIndex(2)}
      >
        <p className="md:text-sm">
          <span className="text-pool-dark">Já possui uma conta? </span>
          <Link className="underline" href="/login">
            Entrar agora
          </Link>
        </p>
      </Form>
    </>,
    <>
      <Form
        title={
          <TitleSubtitle
            title="Endereço"
            subtitle="
            Adicione o seu endereço para futuros serviços (endereço do local da
            piscina)"
          />
        }
        buttonLabel={"Próximo"}
        fields={
          <>
            <Input
              label="Rua"
              name="street"
              type="text"
              value={street}
              setValue={setStreet}
              placeholder="Rua XYZ"
            />
            <Input
              label="Número"
              name="street"
              type="text"
              value={number}
              setValue={setNumber}
              placeholder="0"
              className="w-2/5"
            />
            <Input
              label="Complemento (opcional)"
              name="complement"
              type="text"
              value={complement}
              setValue={setComplement}
              placeholder="Apartamento 0"
            />
            <Select
              label="Estado"
              name="state"
              value={state}
              setValue={setState}
              placeholder="-- Selecione um estado --"
            >
              {states.map((sail) => {
                return (
                  <option key={sail} value={sail}>
                    {sail}
                  </option>
                );
              })}
            </Select>
            <Select
              label="Cidade"
              name="city"
              value={city}
              setValue={setCity}
              placeholder="-- Selecione uma cidade --"
            >
              {cities.map((name) => {
                return (
                  <option key={name} value={name}>
                    {name}
                  </option>
                );
              })}
            </Select>
            <Input
              label="Referência"
              name="reference"
              type="text"
              value={reference}
              setValue={setReference}
              placeholder=""
            />
          </>
        }
        onSubmit={(e) => e.preventDefault()}
        onBack={() => setPageIndex(1)}
        onClick={() => setPageIndex(3)}
      ></Form>
    </>,
    <>
      <Form
        title={
          <TitleSubtitle
            title="Senha"
            subtitle="
            Crie a sua nova senha."
          />
        }
        buttonLabel={"Próximo"}
        fields={
          <>
            <Input
              label="Senha"
              name="password"
              value={password}
              setValue={setPassword}
            />
            <Input
              label="Repita a senha"
              name="password"
              value={confirmPassword}
              setValue={setConfirmPassword}
            />
          </>
        }
        onSubmit={(e) => e.preventDefault()}
        onBack={() => setPageIndex(2)}
        onClick={() => router.push("/confirmar_conta")}
      ></Form>
    </>,
  ];

  return <DefaultContainer>{pages[pageIndex]}</DefaultContainer>;
}

export default Registro;
