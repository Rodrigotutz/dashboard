"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/dashboard/data-table";
import { PlusCircle, UserCogIcon } from "lucide-react";
import { getColumns } from "./columns"; 
import { User } from "@/@types/user";
import { getUsers } from "@/@utils/auth/getUsers";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import RegisterUser from "@/components/user/registerUser";

export default function Page() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const response = await getUsers();
    if (Array.isArray(response)) {
      setData(response);
    }
    setLoading(false);
  }

  const columns = getColumns(fetchUsers); 
  return (
    <div className="dark">
      <div className="flex justify-between items-center border-b pb-10">
        <h2 className="font-bold text-xl flex items-center gap-2">
          <UserCogIcon size={30} /> Usuários
        </h2>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle /> Novo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AlertDialogHeader>
              <DialogTitle>Novo Usuário</DialogTitle>
              <RegisterUser
                isAdmin
                onSuccess={() => {
                  setDialogOpen(false);
                  fetchUsers();
                }}
              />
            </AlertDialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-5">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}