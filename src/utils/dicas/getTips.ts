"use server";

import db from "@/lib/db";
import { Message } from "@/types/message";
import { Tips } from "@/types/tips";

export async function getTips(): Promise<Tips[] | Message> {
  try {
    const tips = await db.tips.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
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
      userName: tip.user.name,
      userEmail: tip.user.email,
      title: tip.title,
      likes: tip.likes ?? 0,
      dislikes: tip.dislikes ?? 0,
      content: tip.content,
      public: tip.public ?? false,
    }));

    return formattedTips;
  } catch (error) {
    console.error("Erro ao buscar dicas:", error);
    return {
      success: false,
      message: "Falha ao carregar as dicas",
    };
  }
}
