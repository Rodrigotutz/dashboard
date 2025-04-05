"use server";

import db from "@/lib/db";

export async function deleteSchedule(id: number) {
  try {
    const scheduleExists = await db.schedule.findUnique({
      where: { id },
    });

    if (!scheduleExists) {
      return {
        success: false,
        message: "Agendamento não encontrado",
      };
    }

    await db.schedule.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Agendamento excluído com sucesso",
    };
  } catch (error) {
    return {
      success: false,
      message: "Erro ao excluir agendamento",
    };
  }
}
