"use server";

import db from "@/lib/db";
import { hashSync } from "bcrypt-ts";
import { Message } from "@/@types/message";

export async function alterPasswordAction(
  formData: FormData
): Promise<Message> {
  const entries = Array.from(formData.entries());

  const data = Object.fromEntries(entries) as {
    password: string;
    userId: string;
  };

  if (!data.password) {
    return { success: false, message: "Informe uma senha" };
  }

  if (data.password.length < 8) {
    return {
      success: false,
      message: "Sua senha deve ter pelo menos 8 caracteres",
    };
  }

  const userId = Number(data.userId);

  if (!userId) {
    return { success: false, message: "Usuário inválido" };
  }

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { success: false, message: "Usuário não encontrado" };
  }

  const hashedPassword = hashSync(data.password, 10);

  try {
    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await db.passwordResetToken.deleteMany({
      where: { userId },
    });

    return { success: true, message: "Senha alterada com sucesso!" };
  } catch (err) {
    if (err) {
      return { success: false, message: "Erro ao atualizar a senha." };
    }

    return { success: false, message: "Tente novamente mais tarde." };
  }
}
