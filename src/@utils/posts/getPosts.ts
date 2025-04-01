"use server";

import db from "@/lib/db";
import { Posts } from "@/@types/posts";

export async function getPosts() {
  try {
    await db.$connect();

    const tips = await db.post.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            type: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    const formattedTips: Posts[] = tips.map((post) => ({
      id: post.id,
      userId: post.userId,
      userName: post.user?.name || "Anônimo",
      userEmail: post.user?.email || "",
      userType: post.user?.type || "user",
      title: post.title,
      slug: post.slug,
      likes: post.likes ?? 0,
      dislikes: post.dislikes ?? 0,
      content: post.content,
      public: post.public ?? false,
    }));

    return formattedTips;
  } catch (error: any) {
    console.error("Erro ao buscar postagens:", error);
  } finally {
    await db.$disconnect();
  }
}
