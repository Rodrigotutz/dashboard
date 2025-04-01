"use server";

import db from "@/lib/db";

export async function getPublicPostByTitle(title: string) {
  try {
    const tip = await db.post.findFirst({
      where: {
        public: true,
        title: {
          equals: title,
          mode: "insensitive",
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return tip || null;
  } catch (error) {
    console.error("Erro ao procurar por postagem:", error);
    return null;
  } finally {
    await db.$disconnect();
  }
}
