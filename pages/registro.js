import { useEffect, useState } from "react";
import Box from "./interface/components/Box";
import symbol from "public/principal-symbol.svg";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

function Registro() {
  const router = useRouter();

  const [pageIndex, setPageIndex] = useState(0);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectState, setSelectState] = useState("");
  const [selectCity, setSelectCity] = useState("");

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
    if (!selectState) return;

    async function fetchCities() {
      const citiesResponse = await fetch(
        `https://brasilapi.com.br/api/ibge/municipios/v1/${selectState}`,
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
  }, [selectState]);

  const pages = [
    <>
      <Box flex={true} direction="col" items="center" gap={2}>
        <h1 className="font-bold text-3xl md:text-2xl">Registro</h1>
        <p>Vamos iniciar seu registro?</p>
      </Box>
      <Box box={true} flex={true} color={"dark"} className="rounded-md mb-4">
        <button
          onClick={() => setPageIndex(1)}
          className="py-4 px-8 md:py-3 md:px-6 text-lg md:text-sm text-pool-white"
          type="submit"
        >
          Iniciar
        </button>
      </Box>
      <p className="md:text-sm">
        <span className="text-pool-dark">Já possui uma conta? </span>
        <Link className="underline" href="/login">
          Entrar agora
        </Link>
      </p>
    </>,
    <>
      <form
        className="flex flex-col items-center gap-8 mb-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <Box
          flex={true}
          direction="col"
          items="center"
          gap={2}
          className="w-64 text-center"
        >
          <h1 className="font-bold text-3xl md:text-2xl whitespace-nowrap">
            Dados Pessoais
          </h1>
          <p className="text-sm">
            Preencha os campos abaixo com os seus dados para iniciar o cadastro.
          </p>
        </Box>
        <Box
          id="fields-box"
          flex={true}
          direction="col"
          items="center"
          justify="center"
          gap={8}
          className="gap-4"
        >
          <Box id="name-field-box" flex={true} direction="col" gap={1}>
            <label className="font-bold text-pool-dark text-xl md:text-lg">
              Nome
            </label>
            <input
              type="text"
              name="text"
              className="focus:outline-none rounded-md drop-shadow-xl w-64 px-4 py-2 text-sm md:px-3 md:py-1 md:text-xs shadow-pool-light/25 text-pool-dark"
              placeholder="Fulano da Silva"
            />
          </Box>
          <Box id="cpf-field-box" flex={true} direction="col" gap={1}>
            <label className="font-bold text-pool-dark text-xl md:text-lg">
              CPF
            </label>
            <input
              type="text"
              name="cpf"
              className="focus:outline-none rounded-md drop-shadow-xl w-64 px-4 py-2 text-sm md:px-3 md:py-1 md:text-xs shadow-pool-light/25 text-pool-dark"
              placeholder="012.345.678-90"
            />
          </Box>
          <Box id="email-field-box" flex={true} direction="col" gap={1}>
            <label className="font-bold text-pool-dark text-xl md:text-lg">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="focus:outline-none rounded-md drop-shadow-xl w-64 px-4 py-2 text-sm md:px-3 md:py-1 md:text-xs shadow-pool-light/25 text-pool-dark"
              placeholder="exemplo@email.com"
            />
          </Box>
          <Box id="birthday-field-box" flex={true} direction="col" gap={1}>
            <label className="font-bold text-pool-dark text-xl md:text-lg">
              Data de Nascimento
            </label>
            <input
              type="date"
              name="birthday"
              className="focus:outline-none rounded-md text-sm drop-shadow-xl w-64 px-4 py-2 md:px-3 md:py-1 md:text-xs shadow-pool-light/25 text-pool-dark"
            />
          </Box>
        </Box>
        <Box flex={true} gap={2}>
          <button
            onClick={() => setPageIndex(0)}
            className="py-4 px-8 md:py-3 md:px-6 md:text-sm text-pool-dark"
          >
            <Image className="h-6" src="/icons/arrow-left.svg" alt="" />
          </button>
          <Box box={true} flex={true} color={"dark"} className="rounded-md">
            <button
              onClick={() => setPageIndex(2)}
              className="py-4 px-8 md:py-3 md:px-6 md:text-sm text-pool-white"
            >
              Próximo
            </button>
          </Box>
        </Box>
      </form>
      <p className="md:text-sm">
        <span className="text-pool-dark">Já possui uma conta? </span>
        <Link className="underline" href="/login">
          Entrar agora
        </Link>
      </p>
    </>,
    <>
      <form
        className="flex flex-col items-center gap-8 mb-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <Box
          flex={true}
          direction="col"
          items="center"
          gap={2}
          className="w-64 text-center"
        >
          <h1 className="font-bold text-3xl md:text-2xl whitespace-nowrap">
            Endereço
          </h1>
          <p className="text-sm">
            Preencha os campos abaixo com os seus dados para iniciar o cadastro.
          </p>
        </Box>
        <Box
          id="fields-box"
          flex={true}
          direction="col"
          items="start"
          gap={8}
          className="gap-4"
        >
          <Box id="street-field-box" flex={true} direction="col" gap={1}>
            <label className="font-bold text-pool-dark text-xl md:text-lg">
              Rua
            </label>
            <input
              type="text"
              name="text"
              className="focus:outline-none rounded-md drop-shadow-xl w-64 px-4 py-2 text-sm md:px-3 md:py-1 md:text-xs shadow-pool-light/25 text-pool-dark"
              placeholder="Avenida Brasil"
            />
          </Box>
          <Box
            id="number-field-box"
            flex={true}
            direction="col"
            gap={1}
            className="w-1/3"
          >
            <label className="font-bold text-pool-dark text-xl md:text-lg">
              Número
            </label>
            <input
              type="text"
              name="number"
              className="focus:outline-none rounded-md drop-shadow-xl w-full px-4 py-2 text-sm md:px-3 md:py-1 md:text-xs shadow-pool-light/25 text-pool-dark"
              placeholder="012"
            />
          </Box>
          <Box id="complement-field-box" flex={true} direction="col" gap={1}>
            <label className="font-bold text-pool-dark text-xl md:text-lg">
              Complemento (opcional)
            </label>
            <input
              type="text"
              name="complement"
              className="focus:outline-none rounded-md drop-shadow-xl w-64 px-4 py-2 text-sm md:px-3 md:py-1 md:text-xs shadow-pool-light/25 text-pool-dark"
              placeholder="Ao lado da loja x"
            />
          </Box>
          <Box id="state-field-box" flex={true} direction="col" gap={1}>
            <label className="font-bold text-pool-dark text-xl md:text-lg">
              Estado
            </label>
            <select
              value={selectState}
              onChange={(e) => {
                setSelectState(e.target.value);
              }}
              className="focus:outline-none rounded-md text-sm drop-shadow-xl w-64 px-4 py-2 md:px-3 md:py-1 md:text-xs shadow-pool-light/25 text-pool-dark"
            >
              <option key="" value="">
                -- Selecione um estado --
              </option>
              {states.map((sail) => {
                return (
                  <option key={sail} value={sail}>
                    {sail}
                  </option>
                );
              })}
            </select>
          </Box>
          <Box id="city-field-box" flex={true} direction="col" gap={1}>
            <label className="font-bold text-pool-dark text-xl md:text-lg">
              Cidade
            </label>
            <select
              value={selectCity}
              onChange={(e) => {
                setSelectCity(e.target.value);
              }}
              className="focus:outline-none rounded-md text-sm drop-shadow-xl w-64 px-4 py-2 md:px-3 md:py-1 md:text-xs shadow-pool-light/25 text-pool-dark"
            >
              <option key="" value="">
                -- Selecione uma cidade --
              </option>
              {cities.map((name) => {
                return (
                  <option key={name} value={name}>
                    {name}
                  </option>
                );
              })}
            </select>
          </Box>
          <Box id="reference-field-box" flex={true} direction="col" gap={1}>
            <label className="font-bold text-pool-dark text-xl md:text-lg">
              Referência (opcional)
            </label>
            <input
              type="text"
              name="reference"
              className="focus:outline-none rounded-md text-sm drop-shadow-xl w-64 px-4 py-2 md:px-3 md:py-1 md:text-xs shadow-pool-light/25 text-pool-dark"
            />
          </Box>
        </Box>
        <Box flex={true} gap={2}>
          <button
            onClick={() => setPageIndex(1)}
            className="py-4 px-8 md:py-3 md:px-6 md:text-sm text-pool-dark"
          >
            <Image className="h-6" src="/icons/arrow-left.svg" alt="" />
          </button>
          <Box box={true} flex={true} color={"dark"} className="rounded-md">
            <button
              onClick={() => setPageIndex(3)}
              className="py-4 px-8 md:py-3 md:px-6 md:text-sm text-pool-white"
            >
              Próximo
            </button>
          </Box>
        </Box>
      </form>
      <p className="md:text-sm">
        <span className="text-pool-dark">Já possui uma conta? </span>
        <Link className="underline" href="/login">
          Entrar agora
        </Link>
      </p>
    </>,
    <>
      <form
        className="flex flex-col items-center gap-8 mb-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <Box
          flex={true}
          direction="col"
          items="center"
          gap={2}
          className="w-64 text-center"
        >
          <h1 className="font-bold text-3xl md:text-2xl whitespace-nowrap">
            Senha
          </h1>
          <p className="text-sm">Crie a sua nova senha</p>
        </Box>
        <Box
          id="fields-box"
          flex={true}
          direction="col"
          items="start"
          gap={8}
          className="gap-4"
        >
          <Box id="password-field-box" flex={true} direction="col" gap={1}>
            <label className="font-bold text-pool-dark text-xl md:text-lg">
              Senha
            </label>
            <input
              type="password"
              name="password"
              className="focus:outline-none rounded-md drop-shadow-xl w-64 px-4 py-2 text-sm md:px-3 md:py-1 md:text-xs shadow-pool-light/25 text-pool-dark"
            />
          </Box>
          <Box id="password-field-box" flex={true} direction="col" gap={1}>
            <label className="font-bold text-pool-dark text-xl md:text-lg">
              Repita a senha
            </label>
            <input
              type="password"
              name="password"
              className="focus:outline-none rounded-md drop-shadow-xl w-64 px-4 py-2 text-sm md:px-3 md:py-1 md:text-xs shadow-pool-light/25 text-pool-dark"
            />
          </Box>
        </Box>
        <Box flex={true} gap={2}>
          <button
            onClick={() => setPageIndex(2)}
            className="py-4 px-8 md:py-3 md:px-6 md:text-sm text-pool-dark"
          >
            <Image className="h-6" src="/icons/arrow-left.svg" alt="" />
          </button>
          <Box box={true} flex={true} color={"dark"} className="rounded-md">
            <button
              onClick={() => router.push("/confirmar_conta")}
              className="py-4 px-8 md:py-3 md:px-6 md:text-sm text-pool-white"
            >
              Criar conta
            </button>
          </Box>
        </Box>
      </form>
      <p className="md:text-sm">
        <span className="text-pool-dark">Já possui uma conta? </span>
        <Link className="underline" href="/login">
          Entrar agora
        </Link>
      </p>
    </>,
  ];

  return (
    <Box
      box={true}
      flex={true}
      direction="col"
      items="center"
      justify="center"
      color="light"
      className="p-8 min-h-screen w-screen rounded-none relative"
    >
      <Box
        flex={true}
        items="center"
        justify="center"
        className="z-10 hidden md:flex absolute"
      >
        <Image className="w-max md:w-72" src={symbol.src} alt="" />
        <Image className="w-max md:w-72" src={symbol.src} alt="" />
      </Box>
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
        {pages[pageIndex]}
      </Box>
    </Box>
  );
}

export default Registro;
