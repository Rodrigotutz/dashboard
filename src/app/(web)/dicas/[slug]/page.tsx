import { getPublicTipBySlug } from "@/@actions/tip/getTipBySlug";
import { getPublicPostBySlug } from "@/@utils/posts/getPublicPostBySlug";
import { sanitizeHTML } from "@/@utils/posts/sanitize";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = decodeURIComponent(slug);
  const tip = await getPublicTipBySlug(title);

  if (!tip) {
    return notFound();
  }

  const cleanHtml = sanitizeHTML(tip.content);

  return (
    <div className="flex flex-col md:p-10 bg-white text-neutral-800">
      <article className="h-scren min-w-4xl max-w-6xl mx-auto p-6 flex justify-between flex-col gap-10">
        <div>
          <h1 className="text-3xl font-bold mb-4 pb-2 border-b">{tip.title}</h1>
          <div
            className="prose dark:prose-invert max-w-none 
              [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-6 
              [&_a]:text-blue-500 [&_a]:underline [&_a]:hover:text-blue-700
              [&_img]:max-w-full [&_img]:h-auto [&_img]:mx-auto
              overflow-y-auto flex-1"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />
        </div>

        <div className="w-full not-[]:border-t mt-10 pb-5 border-t border-neutral-400">
          <div className="flex justify-between items-center p-4">
            <div>
              <span className="text-sm text-neutral-00">
                Publicado por: {tip.user.name}
              </span>
            </div>
            <div className="flex gap-4">
              <div className="text-sm text-green-500 flex gap-2 items-center dark:text-blue-400">
                <ThumbsUp size={15} /> {tip.likes || 0}
              </div>
              <span className="text-sm text-red-500 flex gap-2 items-end dark:text-red-400">
                <ThumbsDown size={15} /> {tip.dislikes || 0}
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
