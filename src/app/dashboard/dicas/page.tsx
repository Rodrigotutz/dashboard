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
import { CheckCheckIcon, ThumbsDown, ThumbsUpIcon } from "lucide-react";
import { columns } from "./columns";
import NewTip from "@/components/tips/newTip";
import { Tips } from "@/types/tips";
import { getTips } from "@/utils/dicas/getTips";
import { toast } from "sonner";
import { Message } from "@/types/message";
import registerLike from "@/utils/dicas/registerLike";

export default function Page() {
  const [data, setData] = useState<Tips[]>([]);
  const [selectedTip, setSelectedTip] = useState<Tips | null>(null);
  const [loading, setLoading] = useState(true);
  const [likedTips, setLikedTips] = useState<{ [key: number]: boolean }>({});
  const [dislikedTips, setDislikedTips] = useState<{ [key: number]: boolean }>({});

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
            <DialogTitle className="text-center mb-5">{selectedTip?.title}</DialogTitle>
          </DialogHeader>
          <div
            className="prose dark:prose-invert max-w-sm md:max-w-full overflow-y-auto overflow-x-hidden flex-1"
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

      <DataTable columns={columns} data={data} onRowClick={setSelectedTip} />
    </div>
  );
}
