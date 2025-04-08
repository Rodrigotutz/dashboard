"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Edit, Share2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tip } from "@/@types/tip";
import { Session } from "@/@interfaces/session";
import { LikeButtons } from "@/@actions/tip/like-button";
import { deleteTip } from "@/@actions/tip/tip";

interface TipDialogProps {
  tip: Tip | null;
  open: boolean;
  session: Session | null;
  onOpenChange: (open: boolean) => void;
  onDeleteSuccess: (deletedTipId: number) => void;
  onVoteSuccess: (updatedTip: Tip) => void;
}

export function TipDialog({
  tip,
  open,
  session,
  onOpenChange,
  onDeleteSuccess,
  onVoteSuccess,
}: TipDialogProps) {
  const handleDelete = async () => {
    if (!tip) return;

    try {
      const result = await deleteTip(tip.id);

      if (result.success) {
        toast.success(result.message);
        onDeleteSuccess(tip.id);
        onOpenChange(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Erro ao excluir dica");
      console.error("Erro ao excluir dica:", error);
    }
  };

  const handleEdit = () => {
    toast.success("Modo de edição ativado!");
  };

  const handleShare = () => {
    toast.success("Link copiado para a área de transferência!");
  };

  const showAdminButtons = (tipUserId: number) => {
    const userId = session?.user?.id;
    return (
      session?.user?.type === "admin" ||
      (userId && parseInt(userId) === tipUserId)
    );
  };

  if (!tip) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl min-h-[80vh] max-h-[90vh] flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>Detalhes da Dica</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {showAdminButtons(tip.userId) && (
                <>
                  <Button variant="ghost" size="icon" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleEdit}>
                    <Edit className="h-4 w-4 text-blue-500" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4 text-green-500" />
              </Button>
            </div>

            <h2 className="text-xl font-bold text-center flex-1">
              {tip.title}
            </h2>

            <div className="w-[120px]"></div>
          </div>

          <div className="flex-1 overflow-y-auto px-1">
            <div
              className="prose min-h-[60vh] dark:prose-invert max-w-none 
            [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-6 
            [&_a]:text-blue-500 [&_a]:underline [&_a]:hover:text-blue-700
            overflow-y-auto flex-1"
              dangerouslySetInnerHTML={{ __html: tip.content }}
            />
          </div>

          <div className="border-t pt-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              <p>Criado por: {tip.user?.name || "N/A"}</p>
              <p>
                {new Date(tip.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <LikeButtons
              tipId={tip.id}
              initialLikes={tip.likes || 0}
              initialDislikes={tip.dislikes || 0}
              onVoteSuccess={onVoteSuccess}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
