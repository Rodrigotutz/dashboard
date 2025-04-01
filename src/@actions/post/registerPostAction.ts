"use server";

import { createSlug } from "@/@actions/post/createSlug";
import db from "@/lib/db";

export async function registerPost(postData: {
  userId: number;
  title: string;
  content: string;
  public?: boolean;
}) {
  try {
    if (!postData.userId || !postData.title || !postData.content) {
      return {
        success: false,
        message: "Preencha todos os campos!",
      };
    }

    const newTip = await db.post.create({
      data: {
        userId: postData.userId,
        title: postData.title,
        slug: createSlug(postData.title),
        content: postData.content,
        public: postData.public ?? false,
      },
    });

    return {
      success: true,
      message: "Postagem criada com sucesso!",
      data: newTip,
    };
  } catch (error) {
    console.error("Erro ao criar postagem:", error);
    return {
      success: false,
      message: "Erro ao criar postagem. Tente novamente.",
    };
  }
}
