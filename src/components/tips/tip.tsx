"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SaveAll } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useFormState, useFormStatus } from "react-dom";
import { Session } from "next-auth";
import { createTip } from "@/@actions/tip/tip";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type PostProps = {
  children: React.ReactNode;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="font-bold w-full md:w-44"
      disabled={pending}
    >
      <SaveAll className="mr-2 h-4 w-4" />
      {pending ? "Salvando..." : "Salvar"}
    </Button>
  );
}

export default function Post({ children }: PostProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setSession(data);
      setIsLoading(false);
    }

    fetchSession();
  }, []);

  const handleSubmit = async (formData: FormData) => {
    if (!session?.user?.id) {
      setFormError("Usuário não autenticado");
      return;
    }

    const userId = Number(session.user.id);
    if (isNaN(userId)) {
      toast.error("Não foi possível criar");
      return;
    }

    formData.append("content", content);

    try {
      const result = await createTip(
        userId,
        {
          message: null,
          success: false,
        },
        formData
      );

      if (!result.success) {
        toast.error(result.message);
      }

      toast.success("Dica Criada com sucesso");
      router.push("/dashboard/dicas");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const backLink = "/dashboard/dicas";

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
      <form action={handleSubmit} className="mt-5 flex-1 overflow-y-auto">
        <div className="flex items-center gap-10 mb-10">
          <div className="w-full">
            <Label htmlFor="title" className="mb-2">
              Título:
            </Label>
            <Input
              id="title"
              name="title"
              className="!bg-white text-neutral-900 dark:!bg-white dark:text-neutral-900"
            />
          </div>
        </div>
        <div className="mb-5">
          <Label htmlFor="content" className="mb-2">
            Descrição:
          </Label>
          <Editor
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
            onEditorChange={(newContent: any) => setContent(newContent)}
          />
        </div>
        <div className="flex gap-2 mb-3">
          <Checkbox id="public" name="public" />
          <Label htmlFor="public">Público</Label>
        </div>
        {formError && (
          <p className="text-sm font-medium text-destructive mt-2">
            {formError}
          </p>
        )}
        <div className="mt-10 flex items-center gap-10 justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
