"use server";

import db from "@/lib/db";

export async function getSchedules(options?: {
  userId?: number;
  cityId?: number;
  typeId?: number;
  status?: string;
  dateRange?: { start: Date; end: Date };
}) {
  try {
    const whereClause: any = {};

    if (options?.userId) {
      whereClause.userId = options.userId;
    }

    if (options?.cityId) {
      whereClause.cityId = options.cityId;
    }

    if (options?.typeId) {
      whereClause.typeId = options.typeId;
    }

    if (options?.status) {
      whereClause.status = options.status;
    }

    if (options?.dateRange) {
      whereClause.scheduledDate = {
        gte: options.dateRange.start,
        lte: options.dateRange.end,
      };
    }

    const schedules = await db.schedule.findMany({
      where: whereClause,
      orderBy: {
        scheduledDate: "asc",
      },
      include: {
        type: true,
        city: true,
      },
    });

    return {
      success: true,
      message: "Agendamentos recuperados com sucesso!",
      data: schedules,
    };
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);

    return {
      success: false,
      message: "Erro ao buscar agendamentos. Tente novamente.",
      data: [],
    };
  }
}
