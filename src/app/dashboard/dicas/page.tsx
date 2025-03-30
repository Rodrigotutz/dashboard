"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCheckIcon, Share2Icon, ShareIcon, ThumbsDown, ThumbsUpIcon, Trash2 } from "lucide-react";
import { getColumns } from "./columns";
import NewTip from "@/components/tips/tipEditor";
import { Tips } from "@/types/tips";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { getTips } from "@/utils/tips/getTips";
import registerLike from "@/actions/tips/registerLikeAction";
import deleteTip from "@/utils/tips/deleteTip";

export default function Page() {
  const [isCopied, setIsCopied] = useState(false);
  const [data, setData] = useState<Tips[]>([]);
  const [selectedTip, setSelectedTip] = useState<Tips | null>(null);
  const [loading, setLoading] = useState(true);
  const [likedTips, setLikedTips] = useState<{ [key: number]: boolean }>({});
  const [dislikedTips, setDislikedTips] = useState<{ [key: number]: boolean }>({});
  const [session, setSession] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.dismiss('offline-toast');
      toast.success('Conexão restabelecida');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Sem conexão com a internet', {
        id: 'offline-toast',
        duration: Infinity,
      });
    };

    setIsOnline(navigator.onLine);
    if (!navigator.onLine) handleOffline();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleApiResponse = (result: any) => {
    if (!result) {
      toast.error('Resposta inesperada da API');
      setData([]);
      return;
    }

    if (Array.isArray(result)) {
      setData(result);
    } else if (typeof result === 'object' && result !== null) {
      toast[result.success ? "success" : "error"](result.message || 'Operação realizada', {
        duration: result.duration || 5000,
      });
      if (!result.success) setData([]);
    } else {
      toast.error('Formato de resposta inválido da API');
      setData([]);
    }
  };

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/session");
      const sessionData = await res.json();
      setSession(sessionData);
    } catch (error) {
      toast.error('Falha ao carregar sessão');
      console.error("Erro ao buscar sessão:", error);
    }
  };

  const fetchTips = async () => {
    if (!isOnline) {
      toast.error('Operação não disponível offline');
      return;
    }

    try {
      setLoading(true);
      const result = await getTips();
      handleApiResponse(result);
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error('Falha ao carregar dicas');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
    fetchTips();
  }, [isOnline]);

  const handleNewTipAdded = () => {
    fetchTips();
  };

  const handleLikeDislike = async (tipId: number, type: "like" | "dislike") => {
    if (!isOnline) {
      toast.error('Ação não disponível offline');
      return;
    }

    try {
      const result = await registerLike(tipId, type);

      if (!result || !result.success) {
        throw new Error(result?.message || 'Falha ao registrar like/dislike');
      }

      setData((prevData) =>
        prevData.map((tip) =>
          tip.id === tipId
            ? {
              ...tip,
              likes: type === "like" ? (tip.likes ?? 0) + 1 : tip.likes ?? 0,
              dislikes: type === "dislike" ? (tip.dislikes ?? 0) + 1 : tip.dislikes ?? 0,
            }
            : tip
        )
      );

      if (selectedTip && selectedTip.id === tipId) {
        setSelectedTip((prev) =>
          prev
            ? {
              ...prev,
              likes: type === "like" ? (prev.likes ?? 0) + 1 : prev.likes ?? 0,
              dislikes: type === "dislike" ? (prev.dislikes ?? 0) + 1 : prev.dislikes ?? 0,
            }
            : prev
        );
      }

      setLikedTips((prev) => ({
        ...prev,
        [tipId]: type === "like",
      }));

      setDislikedTips((prev) => ({
        ...prev,
        [tipId]: type === "dislike",
      }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar like/dislike');
    }
  };

  const handleDeleteTip = async (tipId: number) => {
    if (!isOnline) {
      toast.error('Ação não disponível offline');
      return;
    }

    try {
      const result = await deleteTip(tipId);

      if (result?.success) {
        toast.success(result.message);
        setSelectedTip(null);
        fetchTips();
      } else {
        toast.error(result?.message || 'Falha ao excluir dica');
      }
    } catch (error) {
      toast.error('Erro ao excluir a dica');
      console.error("Erro ao excluir dica:", error);
    }
  };

  const handleShareClick = () => {
    const baseUrl = window.location.origin;
    const slug = selectedTip?.title
      .toLowerCase()
      .replace(/[^\w\s-]/gi, '')
      .replace(/\s+/g, '-');
    const shareUrl = `${baseUrl}/dicas/${slug}`;

    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    toast.success('Link copiado!' );
    setTimeout(() => setIsCopied(false), 5000);
  };


  return (
    <div className="mt-5 dark">
      <div className="border-b pb-5 flex items-center justify-between">
        <h2 className="font-bold text-xl flex items-center gap-2">
          <CheckCheckIcon /> Dicas do Sistema
        </h2>
        <NewTip onSuccess={handleNewTipAdded} />
      </div>

      <Dialog open={!!selectedTip} onOpenChange={() => setSelectedTip(null)}>
        <DialogContent className="md:min-w-6xl max-h-[80vh] md:max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center">
              <div className="flex items-center">
                {session?.user?.type === 'admin' && (
                  <Button
                    onClick={() => selectedTip?.id && handleDeleteTip(selectedTip.id)}
                    variant="link"
                    className="text-red-500 cursor-pointer hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}

                {
                  (session?.user?.email === selectedTip?.userEmail || session?.user?.type === 'admin') && (
                    <NewTip
                      onSuccess={handleNewTipAdded}
                      tip={selectedTip}
                      onUpdate={(updatedTip) => {
                        setSelectedTip(updatedTip);
                        fetchTips();
                      }}
                    />
                  )
                }

                {selectedTip?.public ? (
                  <Button
                    className="text-sky-400"
                    variant={'link'}
                    onClick={handleShareClick}
                  >
                    {isCopied ? (<span className="text-green-500 flex gap-1 items-center"><CheckCheckIcon className="h-4 w-4" /> Copiado!</span>) : <Share2Icon />}
                  </Button>
                ) : null}

              </div>
              <div className="w-full flex justify-center">
                {selectedTip?.title}
              </div>
            </DialogTitle>
          </DialogHeader>
          <div
            className="prose dark:prose-invert max-w-none 
            [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-6 
            [&_a]:text-blue-500 [&_a]:underline [&_a]:hover:text-blue-700
            overflow-y-auto flex-1"
            dangerouslySetInnerHTML={{ __html: selectedTip?.content || "" }}
          />

          <DialogFooter className="md:shrink-0 flex flex-row justify-between items-center md:relative mt-5 border-t pt-5">
            <span className="md:absolute md:left-0 text-xs">Criado por: {selectedTip?.userName}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="link"
                className={`cursor-pointer ${likedTips[selectedTip?.id ?? 0] ? "bg-blue-500 text-white" : "text-blue-500"}`}
                onClick={() => selectedTip?.id && handleLikeDislike(selectedTip.id, "like")}
              >
                <ThumbsUpIcon />
                <span>{selectedTip?.likes || 0}</span>
              </Button>

              <Button
                variant="link"
                className={`cursor-pointer ${dislikedTips[selectedTip?.id ?? 0] ? "bg-red-500 text-white" : "text-red-500"}`}
                onClick={() => selectedTip?.id && handleLikeDislike(selectedTip.id, "dislike")}
              >
                <ThumbsDown />
                <span>{selectedTip?.dislikes || 0}</span>
              </Button>

            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
        <DataTable
          columns={getColumns()}
          data={data}
          onRowClick={setSelectedTip}
        />
      )}
    </div>
  );
}