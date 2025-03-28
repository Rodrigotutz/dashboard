"use server";

import db from "@/lib/db";

interface CreateRoomResponse {
  success: boolean;
  room?: { id: number; name: string; createdAt: Date; updatedAt: Date };
  message?: string;
  error?: any;
}

export async function createRoom(
  formData: FormData
): Promise<CreateRoomResponse> {
  try {
    const name = formData.get("name") as string;

    if (!name) {
      return { success: false, message: "O nome da sala é obrigatório." };
    }

    const findRoom = await db.room.findUnique({
      where: {
        name: name,
      },
    });

    if(findRoom) {
      return { success: false, message: "Essa sala já existe" };
    }

    const room = await db.room.create({
      data: { name },
    });

    return { success: true, message: "Sala criada com sucesso", room };
  } catch (error: any) {
    console.log(error.message);
    return { success: false, message: "Erro ao criar a sala." };
  }
}
