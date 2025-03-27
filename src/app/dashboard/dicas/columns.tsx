import { Tips } from "@/types/tips";
import { ColumnDef } from "@tanstack/react-table";

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
  ];

  return columns;
};