"use client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSlug } from "@/@utils/createSlug";
import { Posts } from "@/@types/posts";
import { getPublicTips } from "@/@actions/tip/tip";

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
  const [tips, setTips] = useState<Posts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      const data = await getPublicTips();
      if (data) {
        const publicTips = data.filter((tip) => tip.public === true);
        setTips(publicTips);
      }
      setLoading(false);
    };
    fetchTips();
  }, []);

  if (!tips || tips.length === 0) {
    return (
      <div className="bg-white pb-10 h-screen">
        <div className="w-full py-10 bg-neutral-50 text-neutral-800 flex flex-col items-center justify-center shadow-sm">
          <h2 className="text-3xl font-bold mb-2">Dicas</h2>
          <p className="text-sneutral-600">
            Acesse todas as dicas disponíveis no sistema!
          </p>
        </div>
        <div className="w-full max-w-7xl mx-auto mt-8 p-8">
          <div className="border border-neutral-400 h-96 flex text-neutral-800 flex-col items-center justify-center rounded-lg p-8">
            <h3 className="text-2xl font-medium  mb-4">
              {loading ? "Carregando dicas..." : "Nenhuma dica encontrada"}
            </h3>
            <p className=" text-center">
              {loading
                ? "Carregando dicas..."
                : "No momento não há dicas disponíveis."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10 p-5 bg-white h-screen">
      <div className="w-full py-10 bg-neutral-50 text-neutral-800 flex flex-col items-center justify-center shadow-sm">
        <h2 className="text-3xl font-bold mb-2">Dicas</h2>
        <p className="text-neutral-600">
          Acesse todas as dicas disponíveis no sistema!
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto mt-8 rounded-lg overflow-hidden shadow-md">
        <div className="grid grid-cols-12 bg-neutral-700 text-white">
          <div className="col-span-3 px-6 py-3 text-left font-medium">
            Título:
          </div>
          <div className="col-span-5 px-6 py-3 text-left hidden md:block">
            Descrição:
          </div>
          <div className="col-span-2 px-6 py-3 text-left hidden md:block">
            Postado em:
          </div>
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
                <div className="grid grid-cols-12">
                  <div className="w-full col-span-12 sm:col-span-3 px-6 py-4 font-medium text-neutral-800 truncate">
                    {tip.title}
                  </div>
                  <div className="col-span-5 px-6 py-4 text-sm text-neutral-600 truncate hidden md:block">
                    {extractFirstLineText(tip.content).substring(0, 100)}
                    {extractFirstLineText(tip.content).length > 100 && "..."}
                  </div>
                  <div className="col-span-2 px-6 py-4 text-neutral-500 truncate hidden md:block">
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
