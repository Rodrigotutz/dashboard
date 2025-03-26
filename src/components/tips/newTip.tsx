"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function NewTip() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image")) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const target = e.target as FileReader;
            if (target && target.result) {
              const imgTag = `<img src="${target.result}" alt="Imagem colada" style="max-width: 60%;"/>`;
              setContent((prev) => prev + imgTag);
            }
          };
          reader.readAsDataURL(file);
        }
      } else if (item.type === "text/plain") {
        item.getAsString((text) => {
          setContent((prev) => prev + text);
        });
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Processar envio aqui...
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle /> Nova Dica
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-3/5 max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Cadastre uma nova dica</DialogTitle>
          <form onSubmit={handleSubmit} className="mt-5">
            <div className="mb-5">
              <Label className="mb-2" htmlFor="title">
                Título:
              </Label>
              <Input id="title" name="title" />
            </div>

            <div className="mb-5">
              <Label className="mb-2" htmlFor="content">
                Descrição:
              </Label>
              <div
                id="content"
                contentEditable
                className="min-h-[50vh] min-w-[40vw] border p-4 overflow-auto bg-neutral-950 rounded-md "
                dangerouslySetInnerHTML={{ __html: content }}
                onPaste={handlePaste}
              ></div>
            </div>

            <div className="flex gap-2 mb-3">
              <Checkbox name="public" id="public" />
              <Label htmlFor="public">Público</Label>
            </div>

            <div className="text-end">
              <Button className="font-bold">Salvar Dica</Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
