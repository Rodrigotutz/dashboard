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
import { CheckCheckIcon, Edit3, ThumbsDown, ThumbsUpIcon, Trash2 } from "lucide-react";
import { getColumns } from "./columns";
import NewTip from "@/components/tips/newTip";
import { Tips } from "@/types/tips";
import { getTips } from "@/utils/dicas/getTips";
import { toast } from "sonner";
import { Message } from "@/types/message";
import registerLike from "@/utils/dicas/registerLike";
import deleteTip from "@/utils/dicas/deleteTip";

export default function Page() {
  const [data, setData] = useState<Tips[]>([]);
  const [selectedTip, setSelectedTip] = useState<Tips | null>(null);
  const [loading, setLoading] = useState(true);
  const [likedTips, setLikedTips] = useState<{ [key: number]: boolean }>({});
  const [dislikedTips, setDislikedTips] = useState<{ [key: number]: boolean }>({});
  const [session, setSession] = useState<any>(null);

  const handleApiResponse = (result: Tips[] | Message) => {
    if (Array.isArray(result)) {
      setData(result);
    } else {
      toast[result.success ? "success" : "error"](result.message, {
        duration: result.duration || 5000,
      });
      setData([]);
    }
  };

  const fetchSession = async () => {
    const res = await fetch("/api/auth/session");
    const sessionData = await res.json();
    setSession(sessionData);
  };

  const fetchTips = async () => {
    try {
      setLoading(true);
      const result = await getTips();
      handleApiResponse(result);
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro inesperado ao processar a requisição");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
    fetchTips();
  }, []);

  const handleNewTipAdded = () => {
    fetchTips();
  };

  const handleLikeDislike = async (tipId: number, type: "like" | "dislike") => {
    try {
      await registerLike(tipId, type);

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
      toast.error("Erro ao atualizar like/dislike");
    }
  };

  const handleDeleteTip = async (tipId: number) => {
    try {
      const result = await deleteTip(tipId);

      if (result.success) {
        toast.success(result.message);
        setSelectedTip(null);
        fetchTips();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Erro ao excluir a dica");
      console.error("Erro ao excluir dica:", error);
    }
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
              <div className="flex">
                {session?.user?.type === 'admin' && (
                  <Button
                    onClick={() => selectedTip?.id && handleDeleteTip(selectedTip.id)}
                    variant="link"
                    className="text-red-500 cursor-pointer hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="link" className="text-blue-500 cursor-pointer hover:text-blue-700">
                  <Edit3 className="h-4 w-4" />
                </Button>
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

      <DataTable columns={getColumns()} data={data} onRowClick={setSelectedTip} />
    </div>
  );
}