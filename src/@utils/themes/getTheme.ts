"use server";

import db from "@/lib/db";

export default async function getThemes() {
  try {
    const themes = await db.theme.findMany();
    return themes;
  } catch (error: any) {
    console.error("Erro ao buscar Temas", error.message);
    throw new Error("Failed to fetch themes");
  }
}
