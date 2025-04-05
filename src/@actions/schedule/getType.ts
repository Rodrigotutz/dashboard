"use server";

import db from "@/lib/db";

export async function getTypes(options?: {
  activeOnly?: boolean;
}) {
  try {
    const whereClause = options?.activeOnly ? { active: true } : {};

    const types = await db.schedulingType.findMany({
      where: whereClause,
      orderBy: {
        title: 'asc',
      },
    });

    return {
      success: true,
      message: "Tipos de agendamento recuperados com sucesso!",
      data: types,
    };
  } catch (error) {
    console.error("Erro ao buscar tipos de agendamento:", error);
    
    return {
      success: false,
      message: "Erro ao buscar tipos de agendamento. Tente novamente.",
      data: [],
    };
  }
}