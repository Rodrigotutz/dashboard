import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedThemes() {
  const defaultThemes = [
    {
      name: "Light Default",
      primary: "blue-600",
      secondary: "purple-500",
      background: "white",
      surface: "gray-50",
      error: "red-500",
      onPrimary: "white",
      onSecondary: "white",
      onBackground: "gray-900",
      onSurface: "gray-900",
      onError: "white",
      isDefault: true,
    },
    {
      name: "Dark Mode",
      primary: "blue-400",
      secondary: "purple-300",
      background: "gray-900",
      surface: "gray-800",
      error: "red-400",
      onPrimary: "gray-900",
      onSecondary: "gray-900",
      onBackground: "gray-50",
      onSurface: "gray-50",
      onError: "gray-900",
    },
    {
      name: "Emerald",
      primary: "emerald-600",
      secondary: "teal-500",
      background: "white",
      surface: "emerald-50",
      error: "rose-500",
      onPrimary: "white",
      onSecondary: "white",
      onBackground: "gray-900",
      onSurface: "gray-900",
      onError: "white",
    },
  ];

  console.log("Seeding themes...");

  for (const themeData of defaultThemes) {
    await prisma.theme.upsert({
      where: { name: themeData.name },
      update: {},
      create: themeData,
    });
    console.log(`Processed theme: ${themeData.name}`);
  }

  // Garante que apenas um tema seja padrão
  await prisma.theme.updateMany({
    where: {
      name: {
        not: "Light Default",
      },
      isDefault: true,
    },
    data: {
      isDefault: false,
    },
  });

  console.log("Theme seeding completed!");
}
