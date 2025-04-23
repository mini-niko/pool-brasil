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
import { EllipsisVertical } from "lucide-react";
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

function Dashboard() {
  return (
    <>
      <NavigationBar />
      <Container>
        <div className="text-center text-pool-black">
          <h1 className="font-bold text-2xl">OLÁ MAURÍCIO!</h1>
          <h2 className="text-lg ">Aqui está a sua agenda.</h2>
        </div>
        <div className="w-full flex justify-center">
          <CustomTable />
        </div>
      </Container>
    </>
  );
}

function CustomTable() {
  const appointments = [
    {
      client: "Victor Hugo",
      service: "Limpeza",
      date_time: "05/04/2025, às 14:00",
      adress: "Rua XXX",
      observations: "Observações",
    },
    {
      client: "Victor Hugo",
      service: "Limpeza",
      date_time: "05/04/2025, às 14:00",
      adress: "Rua XXX",
      observations: "",
    },
    {
      client: "Victor Hugo",
      service: "Limpeza",
      date_time: "05/04/2025, às 14:00",
      adress: "Rua XXX",
      observations: "",
    },
    {
      client: "Victor Hugo",
      service: "Limpeza",
      date_time: "05/04/2025, às 14:00",
      adress: "Rua XXX",
      observations: "",
    },
    {
      client: "Victor Hugo",
      service: "Limpeza",
      date_time: "05/04/2025, às 14:00",
      adress: "Rua XXX",
      observations: "",
    },
    {
      client: "Victor Hugo",
      service: "Limpeza",
      date_time: "05/04/2025, às 14:00",
      adress: "Rua XXX",
      observations: "",
    },
    {
      client: "Victor Hugo",
      service: "Limpeza",
      date_time: "05/04/2025, às 14:00",
      adress: "Rua XXX",
      observations: "",
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-base">
          <TableHead>Cliente</TableHead>
          <TableHead className="hidden md:table-cell">Serviço</TableHead>
          <TableHead>Data e hora</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment, index) => {
          return (
            <TableRow key={index} className="justify-center">
              <TableCell>{appointment.client}</TableCell>
              <TableCell className="hidden md:table-cell">
                {appointment.service}
              </TableCell>
              <TableCell>{appointment.date_time}</TableCell>
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
          <OpenModal
            content={<DetailsModalContent appointment={appointment} />}
          >
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Detalhes
            </DropdownMenuItem>
          </OpenModal>
          <OpenDeleteConfirmation>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Finalizar
            </DropdownMenuItem>
          </OpenDeleteConfirmation>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function OpenModal({ children, content }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Informações adicionais</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

function DetailsModalContent({ appointment }) {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col gap-2 my-4">
          <Label htmlFor="client">Cliente</Label>
          <Input
            className="disabled:opacity-100 disabled:cursor-default"
            disabled
            id="client"
            value={appointment.client}
          />
        </div>
        <div className="flex flex-col gap-2 my-4">
          <Label htmlFor="service">Serviço</Label>
          <Input
            className="disabled:opacity-100 disabled:cursor-default"
            disabled
            id="service"
            value={appointment.service}
          />
        </div>
        <div className="flex flex-col gap-2 my-4">
          <Label htmlFor="datetime">Data e hora</Label>
          <Input
            className="disabled:opacity-100 disabled:cursor-default"
            disabled
            id="datetime"
            value={appointment.date_time}
          />
        </div>
        <div className="flex flex-col gap-2 my-4">
          <Label htmlFor="adress">Endereço</Label>
          <Input
            className="disabled:opacity-100 disabled:cursor-default"
            disabled
            id="adress"
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
    </>
  );
}

function OpenDeleteConfirmation({ children }) {
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
            <Button variant="ghost" className="w-fit">
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

export default Dashboard;
