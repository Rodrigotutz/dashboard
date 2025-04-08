import { Tip } from "@/@types/tip";
import { ColumnDef } from "@tanstack/react-table";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";

export const columns: ColumnDef<Tip>[] = [
  {
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => <div className="truncate">{row.original.title}</div>,
  },
  {
    accessorKey: "user.name",
    header: "Usuário",
    cell: ({ row }) => <div>{row.original.user.name || "N/A"}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => (
      <div>{new Date(row.original.createdAt).toLocaleDateString("pt-BR")}</div>
    ),
  },
  {
    accessorKey: "public",
    header: "",
    cell: ({ row }) => {
      return row.original.public ? (
        <div className="flex items-center gap-1">
          <LockKeyholeOpen className="text-blue-500" size={15} />
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <LockKeyhole className="text-red-500" size={15} />
        </div>
      );
    },
  },
];
