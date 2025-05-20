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
import { EllipsisVertical, MapPin } from "lucide-react";

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
import Container from "@/interface/components/Container";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { format } from "date-fns";

function Historico() {
  return (
    <>
      <NavigationBar />
      <Container>
        <h1 className="text-2xl text-pool-black font-bold">Histórico</h1>
        <CustomTable />
        <Link className="underline text-pool-black" href="/client">
          Voltar à página principal
        </Link>
      </Container>
    </>
  );
}

function CustomTable() {
  const { isLoading, data } = useSWR(`/api/v1/appointment`, fetcher);

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
        {data &&
          data?.map((appointment) => {
            return (
              <TableRow key={appointment.id} className="justify-center">
                <TableCell>{appointment.professional.name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {appointment.type}
                </TableCell>
                <TableCell>
                  {format(appointment.date_time, "dd/MM/yyyy, 'às' HH:mm")}
                </TableCell>
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
          <div className="flex gap-4">
            <div className="w-2/3 flex flex-col gap-2 my-4">
              <Label htmlFor="professional">Profissional</Label>
              <Input
                className="disabled:opacity-100 disabled:cursor-default"
                disabled
                id="professional"
                value={appointment.professional.name}
              />
            </div>
            <div className="w-1/3 flex flex-col gap-2 my-4">
              <Label htmlFor="professional">Serviço</Label>
              <Input
                className="disabled:opacity-100 disabled:cursor-default"
                disabled
                id="professional"
                value={appointment.type}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-2/3 flex flex-col gap-2 my-4">
              <Label htmlFor="professional">Data e hora</Label>
              <Input
                className="disabled:opacity-100 disabled:cursor-default"
                disabled
                id="professional"
                value={format(appointment.date_time, "dd/MM/yyyy, 'às' HH:mm")}
              />
            </div>
            <div className="w-1/3 flex flex-col gap-2 my-4">
              <Label htmlFor="professional">Status</Label>
              <Input
                className="disabled:opacity-100 disabled:cursor-default"
                disabled
                id="professional"
                value={appointment.status}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 my-4">
            <Label htmlFor="professional">Endereço</Label>
            <Textarea
              className="disabled:opacity-100 disabled:cursor-default"
              disabled
              id="professional"
              value={appointment.location.address}
            />
          </div>
          <div className="flex flex-col gap-2 my-4">
            <Label htmlFor="professional">Referência do local</Label>
            <Input
              className="disabled:opacity-100 disabled:cursor-default"
              disabled
              id="professional"
              value={appointment.location.reference}
            />
          </div>
          <div className="flex flex-col items-start gap-2 my-4">
            <Label htmlFor="professional">Localização</Label>
            <Link
              href={`https://www.google.com/maps?q=${appointment.location.latitude},${appointment.location.longitude}`}
              target="_blank"
            >
              <Button>
                <MapPin />
                Abrir no Google Maps
              </Button>
            </Link>
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
