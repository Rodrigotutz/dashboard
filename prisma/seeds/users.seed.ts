import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcrypt-ts";

const prisma = new PrismaClient();

export async function seedUsers() {
  console.log("🌱 Iniciando seed do usuario root...");
  await prisma.user.upsert({
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

  console.log("✅ Usuario root criado com sucesso:");
}
