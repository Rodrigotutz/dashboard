import { Tips } from "@/@types/tips";
import { ColumnDef } from "@tanstack/react-table";
import { LockKeyhole, LockKeyholeOpen  } from "lucide-react";

export const getColumns = (): ColumnDef<Tips>[] => {
  const columns: ColumnDef<Tips>[] = [
    {
      accessorKey: "title",
      header: "Título",
      cell: ({ row }) => (
        <div className="truncate">
          {row.original.title}
        </div>
      ),
    },
    {
      accessorKey: "userName",
      header: "Usuario",
    },
    {
      accessorKey: "public",
      header: "",
      cell: ({ row }) => {
        return row.original.public ? <LockKeyholeOpen className="text-blue-500" size={15} /> : <LockKeyhole className="text-red-500" size={15} />;
      }
    },
  ];

  return columns;
};