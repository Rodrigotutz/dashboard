"use server";

import db from "@/lib/db";
import { Message } from "@/@types/message";

export default async function deletePost(postId: Number): Promise<Message> {
  const post = await db.post.findFirst({
    where: { id: Number(postId) },
  });

  if (!post) {
    return { success: false, message: "Postagem não encontrada" };
  }

  try {
    await db.post.delete({
      where: { id: post.id },
    });
    return { success: true, message: "Postagem Excluida com sucesso!" };
  } catch (error: any) {
    return {
      success: false,
      message: "Não foi possível excluir essa postagem!",
    };
  } finally {
    await db.$disconnect();
  }
}
