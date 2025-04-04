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
import { ArrowLeft, ArrowLeftCircle, PartyPopper } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

import Confetti from "react-confetti";

function Agendamento() {
  const router = useRouter();

  const [date, setDate] = useState("");

  return (
    <>
      <NavigationBar />
      <div className="flex-1 min-h-[80vh] flex flex-col items-center just py-12 gap-8">
        <h1 className="text-2xl text-pool-black font-bold">Agendamento</h1>
        {step === 1 && (
          <StepOne
            data={data}
            next={() => setStep(2)}
            back={() => router.push("/")}
          />
        )}
        {step === 2 && (
          <StepTwo
            data={data}
            next={() => {
              setTimeout(() => {
                setStep(3);
              }, 3000);
            }}
            back={() => setStep(1)}
          />
        )}
        {step === 3 && <StepThree />}
      </div>
    </>
  );
}

function StepOne({ data, next, back }) {
  const [professional, setProfessional] = data.professional;
  const [service, setService] = data.service;
  const [date, setDate] = data.date;
  const [time, setTime] = data.time;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col items-center gap-8 w-full px-64"
    >
      <div className="w-full flex justify-center gap-24">
        <div className="flex flex-col items-center gap-1 w-80">
          <Label
            htmlFor="professional"
            className="text-xl font-semibold text-pool-black"
          >
            Qual profissional você deseja?
          </Label>
          <Select value={professional} onValueChange={setProfessional}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione seu profissional" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[
                  "Pedro Augusto Marques",
                  "Victor Hugo Cintra Matos",
                  "Dionysius Polidônio",
                ].map((name, index) => {
                  return (
                    <SelectItem key={index} value={name}>
                      {name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-center gap-1 w-80">
          <Label htmlFor="professional" className="text-xl text-pool-black">
            Qual serviço você precisa?
          </Label>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione seu serviço" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {["Limpeza", "Manutenção"].map((name, index) => {
                  return (
                    <SelectItem key={index} value={name}>
                      {name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <Label htmlFor="date" className="text-xl font-semibold text-pool-black">
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
            date.getDay() === 6
          }
        />
        <Select value={time} onValueChange={setTime}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Selecione o horário" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {["8:00", "9:00", "10:00", "11:00", "13:00", "14:00"].map(
                (time, index) => {
                  return (
                    <SelectItem key={index} value={time}>
                      {time}
                    </SelectItem>
                  );
                },
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex w-96 mt-4 items-center justify-evenly">
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
  const [professional, setProfessional] = data.professional;
  const [service, setService] = data.service;
  const [date, setDate] = data.date;
  const [time, setTime] = data.time;

  const [checked, setChecked] = useState(false);

  const [disabled, setDisabled] = useState(false);

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <div className="flex text-center">
          <div className="p-2 w-64 rounded-tl-xl rounded-bl-xs bg-pool-dark shadow-lg shadow-pool-dark/15">
            <span className="font-semibold text-pool-white">
              Nome do profissional
            </span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Label
              htmlFor="date"
              className="text-xl font-semibold text-pool-black"
            >
              Escolhe a data e o horário do agendamento
            </Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md shadow-lg"
            />
            <Select>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Selecione o horário" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="1">8:00</SelectItem>
                  <SelectItem value="2">9:00</SelectItem>
                  <SelectItem value="3">10:00</SelectItem>
                  <SelectItem value="4">11:00</SelectItem>
                  <SelectItem value="5">13:00</SelectItem>
                  <SelectItem value="6">14:00</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-96 mt-4 items-center justify-evenly">
            <Button
              onClick={() => {
                router.push("/");
              }}
              variant="secondary"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Button>
            <Button>Próximo</Button>
          </div>
          <div className="p-2 w-72 rounded-tr-xl rounded-br-xs bg-pool-white shadow-lg shadow-pool-dark/15">
            {service}
          </div>
        </div>

        <div className="flex text-center">
          <div className="p-2 w-64 rounded-tl-xs rounded-bl-xl bg-pool-dark shadow-lg shadow-pool-dark/15">
            <span className="font-semibold text-pool-white">
              Data e hora do agendamento
            </span>
          </div>
          <div className="p-2 w-72 rounded-tr-xl rounded-br-xl bg-pool-white shadow-lg shadow-pool-dark/15">
            {format(date, "dd/MM/yyyy")}
            {", às "}
            {time}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Checkbox id="check" checked={checked} onCheckedChange={setChecked} />
        <Label htmlFor="check">
          Confirmo os dados acima para o agendamento
        </Label>
      </div>
      <div className="flex w-96 mt-4 items-center justify-evenly">
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
        <Button disabled={!checked} onClick={next}>
          Próximo
        </Button>
      </div>
    </>
  );
}

function StepThree() {
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
      <div className="flex items-start gap-4">
        <PartyPopper className="h-12 w-12 text-pool-light" />
        <div className="text-center mt-4 flex flex-col gap-4 w-min">
          <h2 className="text-xl font-semibold w-max">
            Agendamento confirmado com sucesso!
          </h2>
          <p>
            Ficamos felizes em atendê-lo!
            <br />
            Não se preocupe com mais nada, iremos notificar o profissional
            solicitado.
          </p>
        </div>
        <PartyPopper className="h-12 w-12 text-pool-light" />
      </div>
      <Button onClick={() => router.push("/")}>Voltar à página inicial</Button>
    </div>
  );
}

export default Agendamento;
