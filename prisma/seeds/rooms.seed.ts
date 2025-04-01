import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedRooms() {
  console.log("🌱 Iniciando seed das salas...");

  await prisma.room.createMany({
    data: Array.from({ length: 5 }).map((_, i) => ({
      name: `Sala ${i + 1}`,
    })),
    skipDuplicates: true,
  });

  console.log("✅ Salas processadas com sucesso!");

  const allUsers = await prisma.user.findMany({ select: { id: true } });
  const allRooms = await prisma.room.findMany({ select: { id: true } });

  const roomUsers = allRooms.flatMap((room) => {
    const shuffledUsers = [...allUsers]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    return shuffledUsers.map((user) => ({
      roomId: room.id,
      userId: user.id,
    }));
  });

  await prisma.roomUser.createMany({
    data: roomUsers,
    skipDuplicates: true,
  });

  console.log("✅ Usuarios Associados com as salas!");
}
