"use server";

import db from "@/lib/db";

export async function getPublicPostBySlug(slug: string) {
  try {
    const tip = await db.post.findFirst({
      where: {
        public: true,
        slug: {
          equals: slug,
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
    console.error("Erro ao procurar postagem", error);
    return null;
  } finally {
    await db.$disconnect();
  }
}
