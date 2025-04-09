import Link from "next/link";
import { notFound } from "next/navigation";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { getPublicTipBySlug } from "@/@actions/tip/getTipBySlug";
import { sanitizeHTML } from "@/@utils/posts/sanitize";
import { getPublicTips } from "@/@actions/tip/tip";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = decodeURIComponent(slug);

  const tip = await getPublicTipBySlug(title);
  if (!tip) return notFound();

  const allTips = await getPublicTips();
  const otherTips = allTips.filter((t: any) => t.slug !== tip.slug);

  const cleanHtml = sanitizeHTML(tip.content);

  return (
    <div className="flex items-start gap-20 md:p-10 p-4 bg-white text-neutral-800 mt-10">
      <div className="w-1/6 min-h-72 border-2 rounded p-5 shadow-lg">
        <h3 className="text-center font-bold border-b pb-5">Veja mais Dicas</h3>
        <ul className="mt-4 space-y-3">
          {otherTips.map((t) => (
            <li key={t.id}>
              <Link
                href={`/dicas/${encodeURIComponent(t.slug)}`}
                className="text-sm text-blue-600 hover:underline block"
              >
                {t.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <article className="w-full flex flex-col gap-10">
        <div>
          <h1 className="w-full text-xl sm:text-3xl text-center font-bold mb-4 pb-5 border-b">
            {tip.title}
          </h1>
          <div
            className="prose dark:prose-invert max-w-full w-full
              [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-6 
              [&_a]:text-blue-500 [&_a]:underline [&_a]:hover:text-blue-700
              [&_img]:max-w-full [&_img]:h-auto
              overflow-hidden break-words"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />
        </div>

        <div className="w-full border-t mt-10 pb-5 border-neutral-400">
          <div className="flex justify-between items-center p-4 flex-wrap gap-2">
            <span className="text-sm text-neutral-600">
              Publicado por: {tip.user.name}
            </span>
            <div className="flex gap-4">
              <div className="text-sm text-green-500 flex gap-2 items-center dark:text-blue-400">
                <ThumbsUp size={15} /> {tip.likes || 0}
              </div>
              <div className="text-sm text-red-500 flex gap-2 items-center dark:text-red-400">
                <ThumbsDown size={15} /> {tip.dislikes || 0}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
