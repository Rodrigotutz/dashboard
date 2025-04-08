"use server";

import { createSlug } from "@/@utils/createSlug";
import db from "@/lib/db";

export async function updatePost(
  postId: number,
  postData: {
    title: string;
    content: string;
    public?: boolean;
  }
) {
  try {
    if (!postId || !postData.title || !postData.content) {
      return {
        success: false,
        message: "Preencha todos os campos!",
      };
    }

    const existingTip = await db.post.findUnique({
      where: { id: postId },
    });

    if (!existingTip) {
      return {
        success: false,
        message: "Postagem não encontrada!",
      };
    }

    const updatedTip = await db.post.update({
      where: { id: postId },
      data: {
        title: postData.title,
        slug: createSlug(postData.title),
        content: postData.content,
        public: postData.public ?? existingTip.public,
      },
    });

    return {
      success: true,
      message: "Postagem atualizada com sucesso!",
      data: updatedTip,
    };
  } catch (error) {
    console.error("Erro ao atualizar postagem:", error);
    return {
      success: false,
      message: "Erro ao atualizar postagem. Tente novamente.",
    };
  }
}
