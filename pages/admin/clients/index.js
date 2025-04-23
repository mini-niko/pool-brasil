import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Container from "@/interface/components/Container";
import NavigationBar from "@/interface/components/NavigationBar";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";

function Clients() {
  return (
    <>
      <NavigationBar />
      <Container>
        <div className="text-center text-pool-black">
          <h1 className="font-bold text-2xl">Clientes</h1>
          <h2 className="text-lg ">Gerencie seus clientes.</h2>
        </div>
        <ClientsTable />
        <Link className="underline text-pool-black" href="/admin">
          Voltar à página principal
        </Link>
      </Container>
    </>
  );
}

function ClientsTable() {
  const clients = [
    {
      name: "José da Silva",
      email: "jose.silva@gmail.com",
      cpf: "123.456.789-00",
      creation_data: "10/04/2025, às 19:23",
      last_update_data: "10/04/2025, às 19:23",
    },
    {
      name: "Maria Oliveira",
      email: "maria.oliveira@yahoo.com",
      cpf: "234.567.890-11",
      creation_data: "11/04/2025, às 08:15",
      last_update_data: "11/04/2025, às 08:15",
    },
    {
      name: "Carlos Souza",
      email: "carlos.souza@hotmail.com",
      cpf: "345.678.901-22",
      creation_data: "12/04/2025, às 14:42",
      last_update_data: "12/04/2025, às 14:42",
    },
    {
      name: "Ana Paula Costa",
      email: "ana.paula@gmail.com",
      cpf: "456.789.012-33",
      creation_data: "13/04/2025, às 16:30",
      last_update_data: "13/04/2025, às 16:30",
    },
    {
      name: "Fernando Lima",
      email: "fernando.lima@outlook.com",
      cpf: "567.890.123-44",
      creation_data: "13/04/2025, às 10:05",
      last_update_data: "13/04/2025, às 10:05",
    },
    {
      name: "Juliana Martins",
      email: "juliana.martins@gmail.com",
      cpf: "678.901.234-55",
      creation_data: "14/04/2025, às 09:20",
      last_update_data: "14/04/2025, às 09:20",
    },
    {
      name: "Rafael Pereira",
      email: "rafael.pereira@uol.com.br",
      cpf: "789.012.345-66",
      creation_data: "14/04/2025, às 18:00",
      last_update_data: "14/04/2025, às 18:00",
    },
    {
      name: "Larissa Fernandes",
      email: "larissa.fernandes@gmail.com",
      cpf: "890.123.456-77",
      creation_data: "15/04/2025, às 11:47",
      last_update_data: "15/04/2025, às 11:47",
    },
    {
      name: "Bruno Rocha",
      email: "bruno.rocha@icloud.com",
      cpf: "901.234.567-88",
      creation_data: "15/04/2025, às 15:35",
      last_update_data: "15/04/2025, às 15:35",
    },
    {
      name: "Camila Ribeiro",
      email: "camila.ribeiro@gmail.com",
      cpf: "012.345.678-99",
      creation_data: "16/04/2025, às 13:12",
      last_update_data: "16/04/2025, às 13:12",
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-base">
          <TableHead>Nome</TableHead>
          <TableHead>CPF</TableHead>
          <TableHead className="hidden md:table-cell">Email</TableHead>
          <TableHead className="hidden md:table-cell">
            Data de criação
          </TableHead>
          <TableHead className="hidden md:table-cell">
            Última atualização
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client, index) => {
          return (
            <TableRow key={index} className="justify-center">
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.cpf}</TableCell>
              <TableCell className="hidden md:table-cell">
                {client.email}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {client.creation_data}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {client.last_update_data}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="fit">
                  <EllipsisVertical className="w-8 h-8" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default Clients;
