import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
  { title: "tip", label: "Dica" },
  { title: "post", label: "Postagem" },
  { title: "warning", label: "Aviso" },
];

export async function seedCategories() {
  console.log("🌱 Iniciando seed de categorias...");

  try {
    const results = await prisma.$transaction(
      defaultCategories.map((category) =>
        prisma.category.upsert({
          where: { title: category.title },
          update: { label: category.label }, 
          create: category, 
        })
      )
    );

    console.log(`✅ Categorias criadas com sucesso!`);
  } catch (error) {
    console.error("❌ Erro ao semear categorias:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
