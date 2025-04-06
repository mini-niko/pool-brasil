import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NavigationBar from "@/interface/components/NavigationBar";
import { EllipsisVertical } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Link from "next/link";

function Historico() {
  return (
    <>
      <NavigationBar />
      <div className="flex-1 flex flex-col items-center py-12 md:px-64 gap-8">
        <h1 className="text-2xl text-pool-black font-bold">Histórico</h1>
        <CustomTable />
        <Link className="underline text-pool-black" href="/">
          Voltar à página principal
        </Link>
      </div>
    </>
  );
}

function CustomTable() {
  const appointments = [
    {
      professional: "Victor Hugo",
      service: "Limpeza",
      date_time: "05/04/2025, às 14:00",
      adress: "Rua XXX",
      observations: "Observações",
    },
    {
      professional: "Victor Hugo",
      service: "Limpeza",
      date_time: "05/04/2025, às 14:00",
      adress: "Rua XXX",
      observations: "",
    },
    {
      professional: "Victor Hugo",
      service: "Limpeza",
      date_time: "05/04/2025, às 14:00",
      adress: "Rua XXX",
      observations: "",
    },
    {
      professional: "Victor Hugo",
      service: "Limpeza",
      date_time: "05/04/2025, às 14:00",
      adress: "Rua XXX",
      observations: "",
    },
    {
      professional: "Victor Hugo",
      service: "Limpeza",
      date_time: "05/04/2025, às 14:00",
      adress: "Rua XXX",
      observations: "",
    },
    {
      professional: "Victor Hugo",
      service: "Limpeza",
      date_time: "05/04/2025, às 14:00",
      adress: "Rua XXX",
      observations: "",
    },
    {
      professional: "Victor Hugo",
      service: "Limpeza",
      date_time: "05/04/2025, às 14:00",
      adress: "Rua XXX",
      observations: "",
    },
  ];

  return (
    <Table className="">
      <TableHeader>
        <TableRow className="text-base">
          <TableHead>Profissional</TableHead>
          <TableHead className="hidden md:table-cell">Serviço</TableHead>
          <TableHead>Data e hora</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment, index) => {
          return (
            <TableRow className="justify-center">
              <TableCell>{appointment.professional}</TableCell>
              <TableCell className="hidden">{appointment.service}</TableCell>
              <TableCell>{appointment.date_time}</TableCell>
              <TableCell>
                <OpenModal appointment={appointment}>
                  <Button variant="ghost" size="fit">
                    <EllipsisVertical className="w-8 h-8" />
                  </Button>
                </OpenModal>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function OpenModal({ children, appointment }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Informações adicionais</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 my-4">
            <Label htmlFor="professional">Profissional</Label>
            <Input
              className="disabled:opacity-100 disabled:cursor-default"
              disabled
              id="professional"
              value={appointment.professional}
            />
          </div>
          <div className="flex flex-col gap-2 my-4">
            <Label htmlFor="professional">Serviço</Label>
            <Input
              className="disabled:opacity-100 disabled:cursor-default"
              disabled
              id="professional"
              value={appointment.service}
            />
          </div>
          <div className="flex flex-col gap-2 my-4">
            <Label htmlFor="professional">Data e hora</Label>
            <Input
              className="disabled:opacity-100 disabled:cursor-default"
              disabled
              id="professional"
              value={appointment.date_time}
            />
          </div>
          <div className="flex flex-col gap-2 my-4">
            <Label htmlFor="professional">Endereço</Label>
            <Input
              className="disabled:opacity-100 disabled:cursor-default"
              disabled
              id="professional"
              value={appointment.adress}
            />
          </div>
          <div className="flex flex-col gap-2 my-4">
            <Label htmlFor="observation">Observações</Label>
            <Textarea
              className="disabled:opacity-100 disabled:cursor-default"
              disabled
              id="observation"
              value={appointment.observations}
            />
          </div>
        </div>
        <DialogFooter className="items-end">
          <DialogClose asChild>
            <Button className="w-fit">Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Historico;
