'use server'
import { TipFormState } from '@/@types/tip'
import { createSlug } from '@/@utils/createSlug'
import db from '@/lib/db'
import { Tip } from '@prisma/client'
import { revalidatePath } from 'next/cache'


export async function getAllTips(): Promise<Tip[]> {
  try {
    return await db.tip.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        title: true,
        slug: true,
        likes: true,
        dislikes: true,
        content: true,
        public: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  } catch (error) {
    console.error('Erro ao buscar dicas:', error)
    return []
  }
}

export async function getPublicTips(): Promise<Tip[]> {
  try {
    return await db.tip.findMany({
      where: {
        public: true
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        title: true,
        slug: true,
        likes: true,
        dislikes: true,
        content: true,
        public: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  } catch (error) {
    console.error('Erro ao buscar dicas públicas:', error)
    return []
  }
}

export async function createTip(
  userId: number,
  prevState: TipFormState,
  formData: FormData
): Promise<TipFormState> {
  try {
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const isPublic = formData.get('public') === 'on'
    const slug = createSlug(title)

    if (!title || title.trim().length < 3) {
      return {
        message: "O título deve ter pelo menos 3 caracteres",
        success: false,
        errors: { title: ["O título deve ter pelo menos 3 caracteres"] }
      }
    }

    if (!content || content.trim().length < 10) {
      return {
        message: "O conteúdo deve ter pelo menos 10 caracteres",
        success: false,
        errors: { content: ["O conteúdo deve ter pelo menos 10 caracteres"] }
      }
    }

    const existingTip = await db.tip.findUnique({ where: { slug } })

    if (existingTip) {
      return {
        message: "Já existe uma dica com título similar",
        success: false,
        errors: { title: ["Já existe uma dica com título similar"] }
      }
    }

    await db.tip.create({
      data: { title, slug, content, public: isPublic, userId },
    })

    revalidatePath('/dashboard/dicas')
    return { message: "Dica criada com sucesso!", success: true }
  } catch (error) {
    console.error('Erro ao criar dica:', error)
    return { message: "Erro ao criar dica", success: false }
  }
}

export async function deleteTip(id: number): Promise<{ success: boolean; message: string }> {
  try {
    await db.tip.delete({
      where: { id }
    });

    revalidatePath('/dashboard/dicas');
    return { success: true, message: "Dica deletada com sucesso!" };
  } catch (error) {
    console.error('Erro ao deletar dica:', error);
    return { success: false, message: "Erro ao deletar dica" };
  }
}

export async function registerLike(tipId: number, type: "like" | "dislike") {
  try {
    const updatedTip = await db.tip.update({
      where: { id: Number(tipId) },
      data: {
        [type === "like" ? "likes" : "dislikes"]: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    revalidatePath('/dashboard/dicas');

    return {
      success: true,
      message: "Voto registrado!",
      tip: updatedTip
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateTip(
  tipId: number,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const slug = formData.get("slug") as string;

    if (
      !title || title.trim().length < 3 ||
      !content || content.trim().length < 10 ||
      !slug || slug.trim().length < 3
    ) {
      return { success: false, message: "Título, conteúdo ou slug inválido." };
    }

    await db.tip.update({
      where: { id: tipId },
      data: { title, content, slug },
    });

    revalidatePath("/dashboard/dicas");

    return { success: true, message: "Dica atualizada com sucesso!" };
  } catch (error) {
    console.error("Erro ao atualizar dica:", error);
    return { success: false, message: "Erro ao atualizar dica." };
  }
}

