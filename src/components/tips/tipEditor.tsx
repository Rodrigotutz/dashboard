"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit3Icon, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Editor } from "@tinymce/tinymce-react";
import { Skeleton } from "@/components/ui/skeleton";
import { registerTip } from "@/utils/dicas/registerTips";
import { toast } from "sonner";
import { Tips } from "@/types/tips";
import { updateTip } from "@/utils/dicas/updateTip";

interface NewTipProps {
  onSuccess?: () => void;
  tip?: Tips | null;
  onUpdate?: (updatedTip: Tips) => void;
}

export default function TipEditor({ onSuccess, tip, onUpdate }: NewTipProps) {
  const [session, setSession] = useState<any>(null);
  const [content, setContent] = useState(tip?.content || "");
  const [title, setTitle] = useState(tip?.title || "");
  const [isPublic, setIsPublic] = useState(tip?.public || false);
  const [editorLoading, setEditorLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchSession() {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setSession(data);
    }
    fetchSession();
  }, []);

  useEffect(() => {
    if (tip) {
      setTitle(tip.title);
      setContent(tip.content);
      setIsPublic(tip.public ?? false);
    } else {
      setTitle("");
      setContent("");
      setIsPublic(false);
    }
  }, [tip]);

  const handleEditorChange = (content: string) => {
    setContent(content);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!session?.user?.id) {
      setIsSubmitting(false);
      return;
    }

    try {
      if (tip && tip.id) {
        const result = await updateTip(tip.id, {
          title,
          content,
          public: isPublic
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        if (result.data && onUpdate) {
          onUpdate({
            ...result.data,
            userName: tip.userName
          });
        }
      } else {
        const result = await registerTip({
          userId: Number(session.user.id),
          title,
          content,
          public: isPublic
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
      }

      setOpen(false);
      if (onSuccess) onSuccess();

    } catch (error) {
      toast.error("Erro ao processar a requisição");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {tip ? (
          <Button variant="ghost" size="sm">
            <Edit3Icon className="h-4 w-4 text-blue-500" />
          </Button>
        ) : (
          <Button>
            <PlusCircle /> Nova Dica
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-11/12 h-11/12 flex flex-col dark">
        <DialogHeader>
          <DialogTitle>{tip ? "Editar Dica" : "Cadastre uma nova dica"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-5 flex-1 overflow-y-auto">
          <div className="mb-5">
            {editorLoading ? (
              <Skeleton className="h-[37px] w-full" />
            ) : (
              <div>
                <Label className="mb-2" htmlFor="title">
                  Título:
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <div className="mb-5">
            <Label className="mb-2" htmlFor="content">
              Descrição:
            </Label>
            {editorLoading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-[600px] w-full" />
              </div>
            ) : null}

            <div style={{ display: editorLoading ? "none" : "block" }}>
              <Editor
                apiKey="1xncjp6ftmlmfrylsguwag7884pouij37b0tl4mxg7svqjoa"
                onInit={() => setEditorLoading(false)}
                value={content}
                init={{
                  height: 400,
                  menubar: false,
                  plugins: "advlist autolink lists link image charmap preview anchor searchreplace",
                  toolbar: "undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
                  paste_data_images: true,
                  content_style: "body { font-family:Arial, sans-serif; font-size:14px }",
                  font_size_formats: "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
                  font_size_input_default_unit: "pt",
                  branding: false,
                }}
                onEditorChange={handleEditorChange}
              />
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <Checkbox
              id="public"
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(!!checked)}
            />
            <Label htmlFor="public">Público</Label>
          </div>
        </form>

        <DialogFooter>
          <Button
            className="font-bold "
            type="submit"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting
              ? "Salvando..."
              : tip
                ? "Atualizar Dica"
                : "Salvar Dica"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}