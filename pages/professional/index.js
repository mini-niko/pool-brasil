import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NavigationBar from "@/interface/components/NavigationBar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, MapPin } from "lucide-react";
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
} from "@radix-ui/react-alert-dialog";
import Container from "@/interface/components/Container";
import useUser from "@/interface/hooks/useUser";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";

function Dashboard() {
  const { isLoading, user } = useUser();
  const name = !isLoading && user ? user.name.split(" ")[0] : "";

  const { data: appointments } = useSWR("/api/v1/appointment", fetcher, {
    refreshInterval: 30000,
    refreshWhenHidden: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  return (
    <>
      <NavigationBar />
      <Container>
        <div className="text-center text-pool-black">
          <h1 className="font-bold text-2xl">OLÁ {name}!</h1>
          <h2 className="text-lg ">Aqui está a sua agenda.</h2>
        </div>
        <div className="w-full flex justify-center">
          <CustomTable data={appointments} />
        </div>
      </Container>
    </>
  );
}

function CustomTable({ data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="text-base">
          <TableHead>Cliente</TableHead>
          <TableHead className="hidden md:table-cell">Serviço</TableHead>
          <TableHead className="hidden md:table-cell">Data e hora</TableHead>
          <TableHead>Status do serviço</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data &&
          data?.map((appointment) => {
            return (
              <TableRow key={appointment.id} className="justify-center">
                <TableCell>{appointment.client.name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {appointment.type}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(appointment.date_time, "dd/MM/yyyy, 'às' HH:mm")}
                </TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell>
                  <OpenDropdownMenu appointment={appointment}>
                    <Button variant="ghost" size="fit">
                      <EllipsisVertical className="w-8 h-8" />
                    </Button>
                  </OpenDropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}

function OpenDropdownMenu({ children, appointment }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <InfoModal appointment={appointment}>
            <DropdownMenuItem>Detalhes</DropdownMenuItem>
          </InfoModal>
          {appointment.status === "Pendente" && (
            <ConfirmConfirmation id={appointment.id}>
              <DropdownMenuItem>Confirmar</DropdownMenuItem>
            </ConfirmConfirmation>
          )}
          {appointment.status === "Confirmado" && (
            <FinishConfirmation id={appointment.id}>
              <DropdownMenuItem>Finalizar</DropdownMenuItem>
            </FinishConfirmation>
          )}
          {!["Cancelado", "Finalizado"].includes(appointment.status) && (
            <CancelConfirmation id={appointment.id}>
              <DropdownMenuItem>Cancelar</DropdownMenuItem>
            </CancelConfirmation>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function InfoModal({ children, appointment }) {
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
              <Label htmlFor="professional">Cliente</Label>
              <Input
                className="disabled:opacity-100 disabled:cursor-default"
                disabled
                id="professional"
                value={appointment.client.name}
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

function ConfirmConfirmation({ children, id }) {
  async function onConfirm() {
    await fetch("/api/v1/appointments", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        status: "confirmed",
      }),
    });

    mutate("/api/v1/appointment");
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar compromisso</AlertDialogTitle>
          <AlertDialogDescription>
            Ao confirmar, seu compromisso será confirmado, notificando o
            usuário, e só poderá cancelá-lo ou finalizá-lo, sem a possibilidade
            de desfazer a ação.
            <br />
            <br />
            Deseja confirmar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center flex-col">
          <AlertDialogAction asChild>
            <Button onClick={onConfirm} variant="ghost" className="w-fit">
              Sim, desejo confirmar
            </Button>
          </AlertDialogAction>
          <AlertDialogCancel asChild>
            <Button className="w-fit">Não, cancelar ação</Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function FinishConfirmation({ children, id }) {
  async function onFinish() {
    await fetch("/api/v1/appointments", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        status: "done",
      }),
    });

    mutate("/api/v1/appointment");
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Ao confirmar, seu compromisso será finalizado, não sendo possível
            desfazer a ação.
            <br />
            <br />
            Deseja finalizar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center flex-col">
          <AlertDialogAction asChild>
            <Button onClick={onFinish} variant="ghost" className="w-fit">
              Sim, desejo finalizar
            </Button>
          </AlertDialogAction>
          <AlertDialogCancel asChild>
            <Button className="w-fit">Não, cancelar ação</Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function CancelConfirmation({ children, id }) {
  async function onCancel() {
    await fetch("/api/v1/appointments", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        status: "cancelled",
      }),
    });

    mutate("/api/v1/appointment");
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Ao confirmar, seu compromisso será CANCELADO, não sendo possível
            desfazer a ação.
            <br />
            <br />
            Deseja cancelar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center flex-row">
          <AlertDialogAction asChild>
            <Button
              onClick={onCancel}
              variant="ghost"
              className="w-1/2 text-red-600"
            >
              Sim, desejo cancelar
            </Button>
          </AlertDialogAction>
          <AlertDialogCancel asChild>
            <Button variant="destructive" className="w-1/2">
              Não, voltar
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Dashboard;
