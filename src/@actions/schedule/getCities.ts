"use server";

import db from "@/lib/db";

export async function getCities(options?: { activeOnly?: boolean }) {
  try {
    const whereClause = options?.activeOnly ? { active: true } : {};

    const cities = await db.city.findMany({
      where: whereClause,
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    });

    return {
      success: true,
      message: "Cidades recuperadas com sucesso!",
      data: cities,
    };
  } catch (error) {
    console.error("Erro ao buscar cidades:", error);

    return {
      success: false,
      message: "Erro ao buscar cidades. Tente novamente.",
      data: [],
    };
  }
}
