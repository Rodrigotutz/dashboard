import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcrypt-ts";

const prisma = new PrismaClient();

export async function seedUsers() {
  const root = await prisma.user.upsert({
    where: { email: process.env.ROOT_DATABASE_EMAIL || "root@mail.com" },
    update: {},
    create: {
      email: process.env.ROOT_DATABASE_EMAIL || "root@mail.com",
      name: process.env.ROOT_DATABASE_NAME || "Administrador",
      password: hashSync(process.env.ROOT_DATABASE_PASSWORD || "123456789"),
      confirmed: true,
      confirmCode: null,
      type: "admin",
      themeId: 1, 
    },
  });

  console.log("Root user created:", root);

  const dummyUsers = Array.from({ length: 10 }).map((_, i) => ({
    email: `user${i + 1}@mail.com`,
    name: `Usuário ${i + 1}`,
    password: hashSync("123456"),
    confirmed: true,
    confirmCode: null,
    themeId: Math.floor(Math.random() * 3) + 1, 
  }));

  await prisma.user.createMany({
    data: dummyUsers,
    skipDuplicates: true,
  });

  console.log("Dummy users created");
}
