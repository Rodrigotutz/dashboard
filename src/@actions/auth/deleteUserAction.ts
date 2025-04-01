"use server";

import { Message } from "@/@types/message";
import db from "@/lib/db";

export default async function deleteUserAction(
  userId: number,
): Promise<Message> {
  if (!userId) {
    return { success: false, message: "ID do usuário não fornecido" };
  }

  const user = await db.user.findUnique({
    where: {
      id: Number(userId),
    },
  });

  if (!user) {
    return { success: false, message: "Usuário não encontrado" };
  }

  await db.user.delete({
    where: {
      id: Number(userId),
    },
  });

  return { success: true, message: "Usuário excluído com sucesso!" };
}
