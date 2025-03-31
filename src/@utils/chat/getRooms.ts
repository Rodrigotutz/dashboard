"use server";
import { auth } from "@/auth";
import db from "@/lib/db";

export async function getRooms() {
  const session = await auth();

  try {
    if (!session?.user?.id) {
      return { success: false, message: "Usuário não autenticado" };
    }

    const rooms = await db.room.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return rooms;
  } catch (error) {
    return { success: false, message: "Erro ao buscar salas" };
  }
}
