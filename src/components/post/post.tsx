"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SaveAll } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type PostProps = {
  type: "dica" | "postagem";
  children: React.ReactNode;
};

export default function Post({ children, type }: PostProps) {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const backLink =
    type === "dica" ? "/dashboard/dicas" : "/dashboard/postagens";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmiting(true);
  };

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="mt-5">
        <div className="border-b pb-5 flex items-center justify-between">
          <h2 className="font-bold text-xl flex items-center gap-2">
            {children}
          </h2>
          <Link href={backLink}>
            <Button variant="outline">Voltar</Button>
          </Link>
        </div>
        <div className="mt-10">
          <div className="flex gap-10 items-center">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-2/5 h-10" />
          </div>
          <div className="mt-10">
            <Skeleton className="h-[600px]" />
          </div>
          <div className="mt-5 flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-4 w-26 rounded-sm" />
          </div>
          <div className="flex justify-end mt-5">
            <Skeleton className="w-40 h-10" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <div className="border-b pb-5 flex items-center justify-between">
        <h2 className="font-bold text-xl flex items-center gap-2">
          {children}
        </h2>
        <Link href={backLink}>
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="mt-5 flex-1 overflow-y-auto">
        <div className="flex items-center gap-10 mb-10">
          <div className="w-full">
            <Label htmlFor="title" className="mb-2">
              Título:
            </Label>
            <Input
              disabled={isSubmiting}
              id="title"
              name="title"
              className="bg-white text-neutral-900"
            />
          </div>
          <div className="w-2/5">
            <Label htmlFor="cat" className="mb-2">
              Categoria:
            </Label>
            <Select defaultValue={type === "dica" ? "tip" : "post"} disabled>
              <SelectTrigger disabled={isSubmiting} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent id="cat">
                {type === "dica" ? (
                  <SelectItem value="tip">Dica</SelectItem>
                ) : (
                  <SelectItem value="post">Postagem</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mb-5">
          <Label htmlFor="content" className="mb-2">
            Descrição:
          </Label>
          <Editor
            disabled={isSubmiting}
            apiKey="1xncjp6ftmlmfrylsguwag7884pouij37b0tl4mxg7svqjoa"
            init={{
              height: 700,
              menubar: false,
              plugins:
                "advlist autolink lists link image charmap preview anchor searchreplace",
              toolbar:
                "undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
              paste_data_images: true,
              content_style:
                "body { font-family:Arial, sans-serif; font-size:14px }",
              font_size_formats: "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
              font_size_input_default_unit: "pt",
              branding: false,
            }}
          />
        </div>
        <div className="flex gap-2 mb-3">
          <Checkbox id="public" disabled={isSubmiting} />
          <Label htmlFor="public">Público</Label>
        </div>
        <div className="mt-10 flex items-center gap-10 justify-end">
          <Button
            type="submit"
            className="font-bold w-full md:w-44"
            disabled={isSubmiting}
          >
            <SaveAll />
            {isSubmiting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
