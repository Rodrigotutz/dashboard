"use server";

import { Category } from "@/@types/category";
import db from "@/lib/db";

export async function getCategories(): Promise<Category[] | undefined> {
  try {
    await db.$connect();

    const categories = await db.category.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return categories;
  } catch (error: any) {
    console.error("Erro ao buscar as categorias:", error);
  } finally {
    await db.$disconnect();
  }
}
