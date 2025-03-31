"use client";

import { User } from "@/@types/user";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import deleteUserAction from "@/@actions/auth/deleteUserAction";
import { Checkbox } from "@/components/ui/checkbox";

export const getColumns = (onDeleteSuccess: () => void): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => {
      const selectedRows = table.getFilteredSelectedRowModel().rows.length;

      const handleDeleteSelected = async () => {
        const selectedUsers = table
          .getFilteredSelectedRowModel()
          .rows.map((row) => row.original.id);

        if (selectedUsers.length === 0) return;

        const results = await Promise.all(
          selectedUsers.map((id) => deleteUserAction(id))
        );

        const successCount = results.filter((r) => r.success).length;

        if (successCount > 0) {
          toast.success(`${successCount} usuário(s) excluído(s) com sucesso.`);
          onDeleteSuccess();
          table.setRowSelection({});
        } else {
          toast.error("Falha ao excluir usuários.");
        }
      };

      return (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
          {selectedRows > 0 && (
            <div className="md:absolute right-1 ">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div>
                    <Button
                      className="text-red-500 md:hidden"
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 />
                    </Button>
                    <Button
                      className="text-red-500 hidden md:block"
                      variant="outline"
                      size="sm"
                    >
                      Excluir Selecionados
                    </Button>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Excluir todos selecionados?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não pode ser desfeita. Isso excluirá
                      permanentemente os usuários selecionados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer hover:bg-gray-200">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteSelected}
                      className="cursor-pointer bg-red-500 hover:bg-red-600 text-white"
                    >
                      Excluir todos
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      );
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },

  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ getValue }) => {
      const type = getValue();
      return type === "admin" ? "Administrador" : "Usuário";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Entrou em",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return createdAt ? new Date(createdAt).toLocaleDateString("pt-BR") : "-";
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const user = row.original;
      const router = useRouter();
      const selectedRows = table.getFilteredSelectedRowModel().rows.length;

      if (selectedRows > 0) return null;

      const handleDelete = async () => {
        const result = await deleteUserAction(user.id);

        if (result.success) {
          toast.success(result.message);
          onDeleteSuccess();
          table.setRowSelection({});
        } else {
          toast.error(result.message);
        }
      };

      return (
        <AlertDialog>
          <AlertDialogTrigger asChild className="cursor-pointer">
            <Trash2 className="h-4 w-4 text-red-500 " />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser desfeita. Isso excluirá permanentemente o
                usuário.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer hover:bg-gray-200">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="cursor-pointer bg-red-500 hover:bg-red-600 text-white"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
