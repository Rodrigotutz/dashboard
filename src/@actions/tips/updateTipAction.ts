"use server";

import db from "@/lib/db";

export async function updateTip(
  tipId: number,
  tipData: {
    title: string;
    content: string;
    public?: boolean;
  }
) {
  try {
    if (!tipId || !tipData.title || !tipData.content) {
      return {
        success: false,
        message: "Preencha todos os campos!",
      };
    }

    const existingTip = await db.tips.findUnique({
      where: { id: tipId },
    });

    if (!existingTip) {
      return {
        success: false,
        message: "Dica não encontrada!",
      };
    }

    const updatedTip = await db.tips.update({
      where: { id: tipId },
      data: {
        title: tipData.title,
        slug: createSlug(tipData.title),
        content: tipData.content,
        public: tipData.public ?? existingTip.public,
      },
    });

    return {
      success: true,
      message: "Dica atualizada com sucesso!",
      data: updatedTip,
    };
  } catch (error) {
    console.error("Erro ao atualizar dica:", error);
    return {
      success: false,
      message: "Erro ao atualizar dica. Tente novamente.",
    };
  }
}
