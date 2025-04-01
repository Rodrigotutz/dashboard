import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedThemes() {
  const defaultThemes = [
    {
      name: "Dark Mode",
      primary: "white",
      secondary: "purple-700",
      background: "neutral-900",
      error: "red-500",
      isDefault: true,
    },
    {
      name: "Light Default",
      primary: "neutral-800",
      secondary: "purple-900",
      background: "white",
      error: "red-500",
    },
  ];

  console.log("🌱 Iniciando seed dos temas...");

  for (const themeData of defaultThemes) {
    await prisma.theme.upsert({
      where: { name: themeData.name },
      update: {},
      create: themeData,
    });
  }

  {
    /**await prisma.theme.updateMany({
    where: {
      name: {
        not: "Dark Mode",
      },
      isDefault: true,
    },
    data: {
      isDefault: false,
    },
  }); */
  }

  console.log("✅ Temas criados com sucesso");
}
