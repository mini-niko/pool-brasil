"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NavigationBar from "@/interface/components/NavigationBar";
import { ArrowLeft, PartyPopper } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { differenceInDays, format, set } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

import Confetti from "react-confetti";
import { Input } from "@/components/ui/input";
import Container from "@/interface/components/Container";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import OpenMap from "@/interface/components/OpenMap";
import useUser from "@/interface/hooks/useUser";

function Agendamento() {
  const router = useRouter();

  const { user } = useUser();

  const [step, setStep] = useState(1);

  const professional = useState("");
  const service = useState("");
  const date = useState("");
  const time = useState("");

  const street = useState("");
  const complement = useState("");
  const number = useState(0);
  const state = useState("SC");
  const city = useState("");
  const reference = useState("");
  const coordinates = useState("");

  const data = {
    professional,
    service,
    date,
    time,
  };

  const adressData = {
    coordinates,
    street,
    complement,
    number,
    state,
    city,
    reference,
  };

  async function postAppointment() {
    const [hours, minutes] = time[0].split(":");
    const { latitude, longitude } = coordinates[0];

    const appointmentData = {
      client_id: user.id,
      professional_id: professional[0].id,
      date_time: set(date[0], { hours, minutes }),
      service_id: service[0].id,
      location: {
        street: street[0],
        complement: complement[0],
        number: number[0],
        state: state[0],
        city: city[0],
        reference: reference[0],
        latitude,
        longitude,
      },
    };

    const response = await fetch("/api/v1/appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    });

    if (response.status !== 201) return false;
    return true;
  }

  return (
    <>
      <NavigationBar />
      <Container>
        <h1 className="text-2xl text-pool-black font-bold">Agendamento</h1>
        {step === 1 && (
          <StepOne
            data={data}
            next={() => setStep(2)}
            back={() => router.push("/client")}
          />
        )}
        {step === 2 && (
          <StepTwo
            data={adressData}
            next={() => {
              setStep(3);
            }}
            back={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <StepThree
            data={{
              ...data,
              ...adressData,
            }}
            next={() => {
              setStep(4);
            }}
            back={() => setStep(2)}
            postAppointment={postAppointment}
          />
        )}
        {step === 4 && <StepFour />}
      </Container>
    </>
  );
}

function StepOne({ data, next, back }) {
  const [professional, setProfessional] = data.professional;
  const [service, setService] = data.service;
  const [date, setDate] = data.date;
  const [time, setTime] = data.time;

  const professionals = useSWR("/api/v1/appointment/professionals", fetcher);
  const services = useSWR("/api/v1/appointment/services", fetcher);

  const formattedDate = date ? format(date, "yyyy-MM-dd") : null;

  const avaliableHours = useSWR(
    formattedDate && professional
      ? `/api/v1/appointments/professional/avaliable-time?date=${formattedDate}&id=${professional.id}`
      : null,
    fetcher,
  );

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex max-h-fit flex-col items-center gap-12 w-full text-center px-8 md:px-64"
    >
      <div className="w-full flex justify-center flex-wrap gap-12">
        <div className="flex flex-col items-center gap-1 w-80">
          <Label
            htmlFor="professional"
            className="text-lg font-semibold text-pool-black"
          >
            Qual profissional você deseja?
          </Label>
          <Select
            onValueChange={(value) => {
              const professional = professionals.data.find(
                (p) => p.id === value,
              );
              setProfessional(professional);
            }}
          >
            <SelectTrigger
              className="w-full"
              disabled={professionals.isLoading}
            >
              <SelectValue placeholder="Selecione seu profissional" />
            </SelectTrigger>
            <SelectContent>
              {professionals.data && (
                <SelectGroup>
                  {professionals.data?.map((user) => {
                    return (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-center gap-1 w-80">
          <Label htmlFor="service" className="text-lg text-pool-black">
            Qual serviço você precisa?
          </Label>
          <Select
            onValueChange={(value) => {
              const service = services.data?.find(
                (s) => s.id === parseInt(value),
              );
              setService(service);
            }}
          >
            <SelectTrigger className="w-full" disabled={services.isLoading}>
              <SelectValue placeholder="Selecione seu serviço" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {services.data?.map((service) => {
                  return (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.type}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <Label htmlFor="date" className="text-lg font-semibold text-pool-black">
          Escolhe a data e o horário do agendamento
        </Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md shadow-lg"
          disabled={(date) =>
            date < new Date(new Date().setHours(0, 0, 0, 0)) ||
            date.getDay() === 0 ||
            date.getDay() === 4 ||
            differenceInDays(date, Date.now()) < 2
          }
        />
        <Select value={time} onValueChange={setTime}>
          <SelectTrigger className="w-56">
            <SelectValue
              placeholder={
                avaliableHours.isLoading
                  ? "Carregando horários..."
                  : avaliableHours.data?.length > 0
                    ? "Selecione o horário"
                    : "Nenhum horário disponível"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {avaliableHours.data &&
                !avaliableHours.error &&
                avaliableHours.data?.map((time) => {
                  return (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  );
                })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex w-full md:w-96 md:mt-4 items-center justify-evenly">
        <Button onClick={back} variant="secondary">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <Button
          disabled={!professional || !service || !date || !time}
          onClick={next}
        >
          Próximo
        </Button>
      </div>
    </form>
  );
}

function StepTwo({ data, next, back }) {
  const [street, setStreet] = data.street;
  const [complement, setComplement] = data.complement;
  const [number, setNumber] = data.number;
  const [state, setState] = data.state;
  const [city, setCity] = data.city;
  const [reference, setReference] = data.reference;

  const [coordinates, setCoordinates] = data.coordinates;

  const allFieldsFilled = street && number && state && city && coordinates;

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

  useEffect(() => {
    (async () => {
      if (!coordinates) return;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.latitude}&lon=${coordinates.longitude}`,
      );

      const data = await response.json();

      setStreet(data.address?.road || "");
      setCity(
        data.address.town?.toUpperCase() || data.address.city?.toUpperCase(),
      );
    })();
  }, [setCity, setStreet, coordinates]);

  return (
    <>
      <div className="w-full h-[512px]">
        <OpenMap setCoordinates={setCoordinates} />
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col items-center gap-8 w-full px-8 md:px-64"
      >
        <div className="w-full flex flex-col items-center gap-8">
          <div className="w-full">
            <Label htmlFor="street" className="text-lg text-pool-black">
              Rua
            </Label>
            <Input
              id="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Ex: Rua das Palmeiras, 456"
            />
          </div>

          <div className="w-full">
            <Label
              htmlFor="complement"
              className="text-lg font-semibold text-pool-black"
            >
              Complemento
            </Label>
            <Input
              id="complement"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
              placeholder="Ex: Apto 301, Bloco A"
            />
          </div>

          <div className="flex gap-8 flex-col md:flex-row w-full">
            <div className="flex-1">
              <Label
                htmlFor="numero"
                className="text-lg font-semibold text-pool-black"
              >
                Número
              </Label>
              <Input
                id="numero"
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Ex: 123"
              />
            </div>
            <div className="flex-1">
              <Label className="text-lg font-semibold text-pool-black">
                Estado
              </Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label className="text-lg font-semibold text-pool-black">
                Cidade
              </Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma cidade" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-full">
            <Label
              htmlFor="reference"
              className="text-lg font-semibold text-pool-black"
            >
              Referência
            </Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex: Próximo ao supermercado XYZ"
            />
          </div>
        </div>

        <div className="flex w-96 mt-4 items-center justify-evenly">
          <Button onClick={back} variant="secondary">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>
          <Button disabled={!allFieldsFilled} onClick={next}>
            Próximo
          </Button>
        </div>
      </form>
    </>
  );
}

function StepThree({ data, next, back, postAppointment }) {
  const [professional] = data.professional;
  const [service] = data.service;
  const [date] = data.date;
  const [time] = data.time;

  const [street] = data.street;
  const [complement] = data.complement;
  const [number] = data.number;
  const [state] = data.state;
  const [city] = data.city;
  const [reference] = data.reference;

  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(false);

  function getCityFormated() {
    return city
      .toLowerCase()
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  }

  function getComplement() {
    return complement ? complement + ", " : "";
  }

  function getFullAdress() {
    return `${street}, ${number}, ${getComplement()}${getCityFormated()}, ${state}`;
  }

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <div className="flex w-full px-8 md:p-0 justify-center flex-col md:flex-row text-center">
          <div className="flex items-center justify-center p-2 w-full md:w-64 rounded-tl-xl rounded-tr-xl md:rounded-tr-none bg-pool-dark shadow-xl shadow-pool-dark/20">
            <span className="font-semibold text-pool-white">
              Nome do profissional
            </span>
          </div>
          <div className="p-2 w-full md:w-72 md:rounded-tr-xl bg-pool-white shadow-xl shadow-pool-dark/20">
            {professional.name}
          </div>
        </div>

        <div className="flex w-full px-8 md:p-0 justify-center flex-col md:flex-row text-center">
          <div className="p-2 w-full md:w-64 bg-pool-dark shadow-xl shadow-pool-dark/20">
            <span className="font-semibold text-pool-white">Serviço</span>
          </div>
          <div className="p-2 w-full md:w-72 bg-pool-white shadow-xl shadow-pool-dark/20">
            {service.type}
          </div>
        </div>

        <div className="flex w-full px-8 md:p-0 justify-center flex-col md:flex-row text-center">
          <div className="p-2 w-full md:w-64 bg-pool-dark shadow-xl shadow-pool-dark/20">
            <span className="font-semibold text-pool-white">
              Data e hora do agendamento
            </span>
          </div>
          <div className="p-2 w-full md:w-72 bg-pool-white shadow-xl shadow-pool-dark/20">
            {format(date, "dd/MM/yyyy")}
            {", às "}
            {time}
          </div>
        </div>

        <div className="flex w-full px-8 md:p-0 justify-center flex-col md:flex-row text-center">
          <div className="flex items-center justify-center p-2 w-full md:w-64 bg-pool-dark shadow-xl shadow-pool-dark/20">
            <span className="font-semibold text-pool-white h-fit">
              Endereço
            </span>
          </div>
          <div className="px-4 py-2 w-full md:w-72 bg-pool-white shadow-xl shadow-pool-dark/20">
            {`${getFullAdress()}`}
          </div>
        </div>

        <div
          className={
            `flex w-full px-8 md:p-0 justify-center flex-col md:flex-row text-center ` +
            (reference == "" && "hidden")
          }
        >
          <div className="p-2 w-full md:w-64 bg-pool-dark shadow-xl shadow-pool-dark/20">
            <span className="font-semibold text-pool-white h-fit">
              Referência
            </span>
          </div>
          <div className="px-4 py-2 min-h-10 w-full md:w-72 bg-pool-white shadow-xl shadow-pool-dark/20">
            {reference}
          </div>
        </div>

        <div className="flex w-full px-8 md:p-0 justify-center flex-col md:flex-row text-center">
          <div className="p-2 w-full md:w-64 md:rounded-bl-xl bg-pool-dark shadow-xl shadow-pool-dark/20">
            <span className="font-semibold text-pool-white h-fit">Valor</span>
          </div>
          <div className="px-4 py-2 w-full md:w-72 rounded-b-xl md:rounded-bl-none bg-pool-white shadow-xl shadow-pool-dark/20">
            R$120,00
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-2 mx-8 text-center">
        <Checkbox id="check" checked={checked} onCheckedChange={setChecked} />
        <Label className="w-fit" htmlFor="check">
          Confirmo os dados acima para o<br />
          agendamento
        </Label>
      </div>
      <div className="flex w-full md:w-96 mt-4 items-center justify-evenly">
        <Button
          disabled={disabled}
          onClick={() => {
            setDisabled(true);
            back();
          }}
          variant="secondary"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <Button
          disabled={!checked || disabled}
          onClick={async () => {
            setDisabled(true);
            const sucessful = await postAppointment();

            if (sucessful) return next();

            setDisabled(false);
          }}
        >
          Próximo
        </Button>
      </div>
    </>
  );
}

function StepFour() {
  const router = useRouter();
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  return (
    <div className="grow flex flex-col items-center justify-center gap-8">
      <Confetti
        width={size.width}
        height={size.height}
        recycle={false}
        numberOfPieces={500}
        tweenDuration={3000}
        gravity={0.2}
      />
      <div className="flex items-start gap-4 px-8 w-full md:w-fit">
        <PartyPopper className="h-12 w-12 text-pool-light hidden md:block" />
        <div className="flex flex-col text-center mt-4  gap-4 w-min">
          <h2 className="text-xl font-semibold w-max">
            Agendamento
            <br />
            confirmado com sucesso!
          </h2>
          <p>
            Ficamos felizes em atendê-lo!
            <br />
            Não se preocupe com mais nada, iremos notificar o profissional
            solicitado.
          </p>
        </div>
        <PartyPopper className="h-12 w-12 text-pool-light hidden md:block" />
      </div>
      <Button onClick={() => router.push("/client")}>
        Voltar à página inicial
      </Button>
    </div>
  );
}

export default Agendamento;
