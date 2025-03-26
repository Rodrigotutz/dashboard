import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcrypt-ts";

const prisma = new PrismaClient();

async function main() {
  const root = await prisma.user.upsert({
    where: { email: process.env.ROOT_DATABASE_EMAIL },
    update: {},
    create: {
      email: process.env.ROOT_DATABASE_EMAIL ?? "root@mail.com",
      name: process.env.ROOT_DATABASE_NAME ?? "Administrador",
      password: hashSync(process.env.ROOT_DATABASE_PASSWORD ?? "123456789"),
      confirmed: true,
      confirmCode: null,
      type: "admin",
    },
  });

  console.log("Usuário padrão criado com sucesso", {
    root,
  });

  {
    /**

  const users = Array.from({ length: 50 }).map((_, i) => ({
    email: `user${i + 1}@mail.com`,
    name: `Usuário ${i + 1}`,
    password: hashSync("123456"),
    confirmed: true,
    confirmCode: null,
  }));

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log("Usuário padrão e 30 usuários fictícios criados com sucesso", {
    root,
  });

  const allUsers = await prisma.user.findMany({ select: { id: true } });

  
    await prisma.room.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      name: `Sala ${i + 1}`,
    })),
    skipDuplicates: true,
  });

  const createdRooms = await prisma.room.findMany({ select: { id: true } });

  const roomUsers = createdRooms.flatMap((room) => {
    const shuffledUsers = allUsers.sort(() => 0.5 - Math.random()).slice(0, 5);
    return shuffledUsers.map((user) => ({ roomId: room.id, userId: user.id }));
  });

  await prisma.roomUser.createMany({
    data: roomUsers,
    skipDuplicates: true,
  });

  console.log(
    "10 salas fictícias criadas com sucesso, associadas a usuários aleatórios"
  );
  */
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
