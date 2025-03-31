"use server";

import db from "@/lib/db";

export async function registerTip(tipData: {
  userId: number;
  title: string;
  content: string;
  public?: boolean;
}) {
  try {
    if (!tipData.userId || !tipData.title || !tipData.content) {
      return {
        success: false,
        message: "Preencha todos os campos!",
      };
    }

    const newTip = await db.tips.create({
      data: {
        userId: tipData.userId,
        title: tipData.title,
        content: tipData.content,
        public: tipData.public ?? false,
      },
    });

    return {
      success: true,
      message: "Dica criada com sucesso!",
      data: newTip,
    };
  } catch (error) {
    console.error("Erro ao criar dica:", error);
    return {
      success: false,
      message: "Erro ao criar dica. Tente novamente.",
    };
  }
}
