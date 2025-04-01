"use client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSlug } from "@/@actions/post/createSlug";
import { Posts } from "@/@types/posts";
import { getPosts } from "@/@utils/posts/getPosts";

const extractFirstLineText = (html: string) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const validTags = [
    "p",
    "span",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "div",
    "section",
  ];

  for (const tag of validTags) {
    const element = tempDiv.querySelector(tag);
    if (element && element.textContent?.trim()) {
      return element.textContent.trim();
    }
  }
  return "";
};

export default function Page() {
  const router = useRouter();
  const [tips, setTips] = useState<Posts[]>([]);
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const fetchTips = async () => {
      const data = await getPosts();
      if (data) {
        const publicTips = data.filter((post) => post.public === true);
        setTips(publicTips);
      }
      setLoading(false);
    };
    fetchTips();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-4">
        <div className="mt-10 mb-10 pb-12 border-b text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">
            Carregando Dicas...
          </h2>
          <p>Aguarde enquanto trago as dicas pra você...</p>
        </div>
        <div className="overflow-hidden">
          <Skeleton className="h-12 w-full bg-neutral-400 rounded-t-lg rounded-b-none" />
          <Skeleton className="h-80 w-full bg-neutral-300 rounded-t-none" />
        </div>
      </div>
    );
  }

  if (!tips || tips.length === 0) {
    return (
      <div className="pb-10">
        <div className="w-full py-10 bg-neutral-50 flex flex-col items-center justify-center shadow-sm">
          <h2 className="text-3xl font-bold text-neutral-800 mb-2">Dicas</h2>
          <p className="text-sneutral-600">
            Acesse todas as dicas disponíveis no sistema!
          </p>
        </div>
        <div className="w-full max-w-7xl mx-auto mt-8 p-8">
          <div className="bg-neutral-800 h-96 flex flex-col items-center justify-center rounded-lg p-8">
            <h3 className="text-2xl font-medium text-white mb-4">
              Nenhuma dica encontrada
            </h3>
            <p className="text-neutral-200">
              No momento não há dicas disponíveis.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="w-full py-10 bg-neutral-50 flex flex-col items-center justify-center shadow-sm">
        <h2 className="text-3xl font-bold text-neutral-800 mb-2">Dicas</h2>
        <p className="text-neutral-600">
          Acesse todas as dicas disponíveis no sistema!
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto mt-8 rounded-lg overflow-hidden shadow-md">
        <div className="grid grid-cols-12 bg-neutral-700 text-white">
          <div className="col-span-3 px-6 py-3 text-left font-medium">
            Título:
          </div>
          <div className="col-span-5 px-6 py-3 text-left">Descrição:</div>
          <div className="col-span-2 px-6 py-3 text-left">Autor:</div>
          <div className="col-span-2 px-6 py-3 text-left">Data:</div>
        </div>

        <div className="divide-y divide-neutral-300">
          {tips.map((tip, index) => {
            const slug = createSlug(tip.title);
            return (
              <Link
                key={tip.id}
                href={`/dicas/${slug}`}
                className={`block w-full hover:bg-blue-100 ${
                  index % 2 === 0 ? "bg-neutral-200" : "bg-white"
                }`}
              >
                <div className="grid grid-cols-12 min-h-16">
                  <div className="col-span-3 px-6 py-4 font-medium text-neutral-800 truncate">
                    {tip.title}
                  </div>
                  <div className="col-span-5 px-6 py-4 text-sm text-neutral-600 truncate">
                    {extractFirstLineText(tip.content).substring(0, 100)}
                    {extractFirstLineText(tip.content).length > 100 && "..."}
                  </div>
                  <div className="col-span-2 px-6 py-4 text-neutral-700 truncate">
                    {tip.userName}
                  </div>
                  <div className="col-span-2 px-6 py-4 text-neutral-500 truncate">
                    {new Date(tip.createdAt || new Date()).toLocaleDateString(
                      "pt-BR"
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
