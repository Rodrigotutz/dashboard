"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CheckCheckIcon,
  PlusCircle,
  ThumbsDown,
  ThumbsUpIcon,
} from "lucide-react";
import { columns } from "./columns";

export default function Page() {
  const [selectedTip, setSelectedTip] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const randomDescriptions = [
    "Falha ao carregar os dados do sistema.",
    "Erro inesperado ao conectar com o servidor.",
    "Conflito de permissões detectado no banco de dados.",
    "Ação não permitida para o usuário atual.",
    "Tempo limite da solicitação excedido.",
    "Erro ao processar a solicitação, tente novamente.",
    "Arquivo corrompido ou formato inválido.",
    "Módulo não encontrado na inicialização.",
    "Falha na autenticação do usuário.",
    "Recurso indisponível no momento, tente mais tarde.",
  ];

  const data: any[] = Array.from({ length: 100 }, (_, i) => ({
    title: `Erro de Script: ${Math.floor(100000 + Math.random() * 900000)}`,
    content:
      randomDescriptions[Math.floor(Math.random() * randomDescriptions.length)],
  }));

  if (!mounted) return null;

  return (
    <div className="mt-5">
      <div className="border-b pb-5 flex items-center justify-between">
        <h2 className="font-bold text-xl flex items-center gap-2">
          <CheckCheckIcon /> Dicas do Sistema
        </h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle /> Nova Dica
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastre uma nova dica</DialogTitle>
              <DialogDescription>Teste</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!selectedTip} onOpenChange={() => setSelectedTip(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTip?.title}</DialogTitle>
          </DialogHeader>
          <p>{selectedTip?.content}</p>
          <DialogFooter>
            <Button variant={"link"} className="text-blue-500 cursor-pointer">
              <ThumbsUpIcon />
            </Button>
            <Button variant={"link"} className="text-red-500 cursor-pointer">
              <ThumbsDown />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DataTable columns={columns} data={data} onRowClick={setSelectedTip} />
    </div>
  );
}
