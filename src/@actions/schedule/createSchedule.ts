"use server";

import db from "@/lib/db";

export async function createSchedule(scheduleData: {
  typeId: number;
  userId: number;
  cityId: number;
  client: string;
  description: string;
  scheduledDate: Date;
}) {
  try {
    const newSchedule = await db.schedule.create({
      data: {
        typeId: scheduleData.typeId,
        userId: scheduleData.userId,
        cityId: scheduleData.cityId,
        client: scheduleData.client.trim(),
        description: scheduleData.description.trim(),
        scheduledDate: scheduleData.scheduledDate,
        status: "pending",
      },
    });

    return { success: true, id: newSchedule.id, message: "Agendamento criado com sucesso" };
  } catch (error: any) {
    console.error("Erro ao criar agendamento:", error);
    return { success: false, message: error.message };
  }
}
