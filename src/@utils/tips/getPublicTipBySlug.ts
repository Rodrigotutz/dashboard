"use server";

import db from "@/lib/db";

export async function getPublicTipBySlug(slug: string) {
  try {
    const tip = await db.tips.findFirst({
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
    console.error("Error fetching public tip:", error);
    return null;
  } finally {
    await db.$disconnect();
  }
}
