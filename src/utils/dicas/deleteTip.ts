"use server";

import db from "@/lib/db";
import { Message } from "@/types/message";

export default async function deleteTip(tipId: Number): Promise<Message> {
  const tip = await db.tips.findFirst({
    where: { id: Number(tipId) },
  });

  if (!tip) {
    return { success: false, message: "Dica não encontrada" };
  }

  try {
    await db.tips.delete({
      where: { id: tip.id },
    });
    return { success: true, message: "Dica Excluida com sucesso!" };
  } catch (error: any) {
    return { success: false, message: "Não foi possível excluir essa dica!" };
  }
}
