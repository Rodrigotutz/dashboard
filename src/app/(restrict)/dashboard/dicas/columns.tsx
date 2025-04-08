"use client";

import { toggleTipPublicStatus } from "@/@actions/tip/tip";
import { Tip } from "@/@types/tip";
import { ColumnDef } from "@tanstack/react-table";
import { LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { toast } from "sonner";

export const columns = (onToggleSuccess: () => void): ColumnDef<Tip>[] => [
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
      const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
          const result = await toggleTipPublicStatus(
            row.original.id,
            !row.original.public
          );
          if (result.success) {
            toast.success(
              `Dica ${!row.original.public ? "pública" : "privada"}`
            );
            onToggleSuccess();
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          toast.error("Erro ao alterar status");
          console.error("Erro ao alternar status:", error);
        }
      };

      return (
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={handleClick}
        >
          {row.original.public ? (
            <LockKeyholeOpen className="text-blue-500" size={15} />
          ) : (
            <LockKeyhole className="text-red-500" size={15} />
          )}
        </div>
      );
    },
  },
];
