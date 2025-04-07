"use server";
import db from "@/lib/db";

export async function getSchedules(options?: {
  userId?: number;
  userType?: string;
  cityId?: number;
  typeId?: number;
  status?: string;
  dateRange?: { start: Date; end: Date };
}) {
  try {
    // 1. Limpar os planos de consulta em cache
    await db.$executeRaw`DISCARD PLANS`;

    // 2. Construir a cláusula WHERE de forma segura
    const whereClause: any = {};

    if (options?.userType !== "admin" && options?.userId) {
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

    // 3. Executar a consulta dentro de uma transação
    const schedules = await db.$transaction(async (tx) => {
      return tx.schedule.findMany({
        where: whereClause,
        orderBy: {
          scheduledDate: "asc",
        },
        include: {
          type: true,
          city: true,
          user: true,
        },
      });
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