"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { CheckCheckIcon, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Tip } from "@/@types/tip";
import { getAllTips } from "@/@actions/tip/tip";
import { columns } from "./columns";
import { Session } from "@/@interfaces/session";
import { TipDialog } from "./TipDialog";

export default function Page() {
  const [data, setData] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/session");
      const sessionData = await res.json();
      setSession(sessionData);
    } catch (error) {
      toast.error("Falha ao carregar sessão");
      console.error("Erro ao buscar sessão:", error);
    }
  };

  const fetchTips = async () => {
    try {
      setLoading(true);
      const result: any = await getAllTips();
      setData(result);
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Falha ao carregar postagens");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (tip: Tip) => {
    setSelectedTip(tip);
    setIsModalOpen(true);
  };

  const handleDeleteSuccess = (deletedTipId: number) => {
    setData((prevData) => prevData.filter((tip) => tip.id !== deletedTipId));
  };

  const handleVoteSuccess = (updatedTip: Tip) => {
    setData((prevData) =>
      prevData.map((tip) => (tip.id === updatedTip.id ? updatedTip : tip))
    );
    if (selectedTip?.id === updatedTip.id) {
      setSelectedTip(updatedTip);
    }
  };

  const handleUpdateSuccess = (updatedTip: Tip) => {
    setData((prevData) =>
      prevData.map((tip) => (tip.id === updatedTip.id ? updatedTip : tip))
    );
    if (selectedTip?.id === updatedTip.id) {
      setSelectedTip(updatedTip);
    }
  };

  useEffect(() => {
    fetchSession();
    fetchTips();
  }, []);

  return (
    <div className="mt-5">
      <div className="border-b pb-5 flex items-center justify-between">
        <h2 className="font-bold text-xl flex items-center gap-2">
          <CheckCheckIcon /> Dicas
        </h2>
        <Link href={"/dashboard/dicas/nova"}>
          <Button>
            <PlusCircle /> Nova Dica
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-4">
          <Skeleton className="max-w-sm h-[35px] rounded-md" />
          <Skeleton className="w-full h-[35px] rounded-b-none mt-5" />
          <Skeleton className="w-full h-[100px] rounded-t-none" />
          <div className="flex justify-end gap-2 mt-5">
            <Skeleton className="w-[97px] h-[30px] rounded-md" />
            <Skeleton className="w-[97px] h-[30px] rounded-md" />
          </div>
        </div>
      ) : (
        <DataTable columns={columns} data={data} onRowClick={handleRowClick} />
      )}

      <TipDialog  
        tip={selectedTip}
        open={isModalOpen}
        session={session}
        onOpenChange={setIsModalOpen}
        onDeleteSuccess={handleDeleteSuccess}
        onVoteSuccess={handleVoteSuccess}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
