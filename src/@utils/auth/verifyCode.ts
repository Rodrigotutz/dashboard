"use server";

import { Message } from "@/@types/message";
import db from "@/lib/db";

export default async function verifyCodeAction(
  formData: FormData
): Promise<Message> {
  const entries = Array.from(formData.entries());
  const data = Object.fromEntries(entries) as { code: string };

  if (!data.code) {
    return {
      success: false,
      message: "Por favor, insira o código de confirmação",
    };
  }

  const user = await db.user.findFirst({
    where: {
      confirmCode: data.code,
    },
  });

  if (!user) {
    return { success: false, message: "Código inválido" };
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      confirmCode: null,
      confirmed: true,
    },
  });

  return {
    success: true,
    message: "E-mail confirmado com sucesso!",
  };
}
