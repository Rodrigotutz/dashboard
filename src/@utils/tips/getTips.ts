"use server";

import db from "@/lib/db";
import { Tips } from "@/@types/tips";

export async function getTips() {
  try {
    await db.$connect();

    const tips = await db.tips.findMany({
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

    const formattedTips: Tips[] = tips.map((tip) => ({
      id: tip.id,
      userId: tip.userId,
      userName: tip.user?.name || "Anônimo",
      userEmail: tip.user?.email || "",
      userType: tip.user?.type || "user",
      title: tip.title,
      likes: tip.likes ?? 0,
      dislikes: tip.dislikes ?? 0,
      content: tip.content,
      public: tip.public ?? false,
    }));

    return formattedTips;
  } catch (error: any) {
    console.error("Erro ao buscar dicas:", error);
  } finally {
    await db.$disconnect();
  }
}
