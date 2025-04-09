"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Share2, Check } from "lucide-react";
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
import { deleteTip, updateTip } from "@/@actions/tip/tip";
import { createSlug } from "@/@utils/createSlug";

interface TipDialogProps {
  tip: Tip | null;
  open: boolean;
  session: Session | null;
  onOpenChange: (open: boolean) => void;
  onDeleteSuccess: (deletedTipId: number) => void;
  onVoteSuccess: (updatedTip: Tip) => void;
  onUpdateSuccess: (updatedTip: Tip) => void;
}

export function TipDialog({
  tip,
  open,
  session,
  onOpenChange,
  onDeleteSuccess,
  onVoteSuccess,
  onUpdateSuccess,
}: TipDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(
    null
  );
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);

  const handleUpdateSuccess = (updatedTip: Tip) => {
    setSelectedTip(updatedTip);
  };

  useEffect(() => {
    if (tip) setTitle(tip.title);
  }, [tip]);

  useEffect(() => {
    if (open) setIsEditing(false);
  }, [open]);

  useEffect(() => {
    if (!isEditing) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedImage) {
        e.preventDefault();
        selectedImage.remove();
        setSelectedImage(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isEditing, selectedImage]);

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
    } catch {
      toast.error("Erro ao excluir dica");
    }
  };

  const handleSave = async () => {
    if (!tip || !contentRef.current) return;

    const slug = createSlug(title);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", contentRef.current.innerHTML);
    formData.append("slug", slug);

    const result = await updateTip(tip.id, formData);

    if (result.success) {
      toast.success(result.message);

      onUpdateSuccess({
        ...tip,
        title,
        content: contentRef.current.innerHTML,
        slug,
      });
    } else {
      toast.error(result.message);
    }

    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleShare = () => {
    if (!tip?.slug) return;

    const isLocalhost =
      typeof window !== "undefined" && window.location.hostname === "localhost";
    const baseUrl = isLocalhost
      ? "http://localhost:3001"
      : "https://tutz-dashboard.vercel.app";

    const url = `${baseUrl}/dicas/${tip.slug}`;
    navigator.clipboard.writeText(url);
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
      <DialogContent className="sm:max-w-5xl min-h-[80vh] max-h-[90vh] flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>Detalhes da Dica</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {isEditing ? (
                <Button variant="ghost" size="icon" onClick={handleSave}>
                  <Check className=" h-4 w-4 text-green-500" />
                </Button>
              ) : (
                <>
                  {showAdminButtons(tip.userId) && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDelete}
                      >
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
                </>
              )}
            </div>

            {isEditing ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-bold flex-1 bg-transparent border-b border-muted outline-none text-center"
              />
            ) : (
              <h2 className="text-xl font-bold text-center flex-1">{title}</h2>
            )}

            <div className="w-[120px]"></div>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <div
              ref={contentRef}
              className="prose min-h-[60vh] dark:prose-invert max-w-none 
                         [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-6 
                       [&_a]:text-blue-500 [&_a]:underline [&_a]:hover:text-blue-700
                         [&_br]:my-4 [&_br]:block [&_br]:content-[''] 
                         overflow-y-auto flex-1 outline-none"
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              dangerouslySetInnerHTML={{ __html: tip.content }}
              onClick={(e) => {
                if (!isEditing) return;
                const target = e.target as HTMLElement;

                if (target.tagName === "IMG") {
                  e.preventDefault();

                  if (selectedImage && selectedImage !== target) {
                    selectedImage.classList.remove(
                      "ring-2",
                      "ring-blue-400",
                      "rounded"
                    );
                  }

                  target.classList.add("ring-2", "ring-blue-400", "rounded");
                  setSelectedImage(target as HTMLImageElement);
                } else {
                  if (selectedImage) {
                    selectedImage.classList.remove(
                      "ring-2",
                      "ring-blue-400",
                      "rounded"
                    );
                    setSelectedImage(null);
                  }
                }
              }}
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
