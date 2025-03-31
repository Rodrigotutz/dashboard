"use client"

import Link from "next/link";
import Form from "next/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Newspaper, SaveAll, Trash2 } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";

export default function Page() {

    const [content, setContent] = useState("");
    const [editorLoading, setEditorLoading] = useState(false);

    const handleSubmit = () => {

    }

    const handleEditorChange = (content: string) => {
        setContent(content);
    };



    return (
        <div>
            <div className="mt-5">
                <div className="border-b pb-5 flex items-center justify-between">
                    <h2 className="font-bold text-xl flex items-center gap-2">
                        <Newspaper /> Nova Postagem
                    </h2>
                    <Link href={"/dashboard/postagens"}><Button variant={"outline"} >Voltar</Button></Link>
                </div>

                {
                    editorLoading ? (
                        <div className="flex flex-col gap-2 mt-1">
                            <div className="flex items-center gap-5">
                                <div className="w-full">
                                    <Skeleton className="h-10" />
                                </div>
                                <div className="w-2/5">
                                    <Skeleton className="h-10" />
                                </div>
                            </div>
                            <div className="w-full mt-10">
                                <Skeleton className="h-[600px]" />
                            </div>
                        </div>
                    ) : (


                        <Form action={handleSubmit} className="mt-10">

                            <div className="flex flex-col md:flex-row items-center gap-5">
                                <div className="w-full">
                                    <Label className="mb-2">Titulo</Label>
                                    <Input className="bg-white text-neutral-900" />
                                </div>
                                <div className="w-full md:w-2/5">
                                    <Label className="mb-2">Categoria</Label>
                                    <Select>
                                        <SelectTrigger className="w-full bg-white text-neutral-900">
                                            <SelectValue placeholder="Selecione uma Categoria" />
                                        </SelectTrigger>
                                        <SelectContent >
                                            <SelectItem value="Postagem">Postagem</SelectItem>
                                            <SelectItem value="Aviso">Aviso</SelectItem>
                                            <SelectItem value="Noticia">Noticia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Editor
                                    apiKey="1xncjp6ftmlmfrylsguwag7884pouij37b0tl4mxg7svqjoa"
                                    onInit={() => setEditorLoading(false)}
                                    value={content}
                                    init={{
                                        height: 700,
                                        menubar: false,
                                        plugins: "advlist autolink lists link image charmap preview anchor searchreplace",
                                        toolbar: "undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
                                        paste_data_images: true,
                                        content_style: "body { font-family:Arial, sans-serif; font-size:14px }",
                                        font_size_formats: "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
                                        font_size_input_default_unit: "pt",
                                        branding: false,
                                    }}
                                />
                            </div>

                            <div className="mt-10 flex items-center gap-2">
                                <Checkbox />
                                <Label>Rascunho</Label>
                            </div>

                            <div className="mt-10 flex items-center gap-10 justify-end">
                                <Button type="submit" className="font-bold w-full md:w-44"><SaveAll /> Criar Postagem</Button>
                            </div>
                        </Form>
                    )}
            </div>
        </div>
    )
}