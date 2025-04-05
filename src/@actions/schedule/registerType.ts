"use server";

import db from "@/lib/db";

export async function registerType(typeData: {
  title: string;
  label: string;
}) {
  try {
    if (!typeData.title?.trim() || !typeData.label?.trim()) {
      return {
        success: false,
        message: "Preencha todos os campos obrigatórios",
        errors: {
          title: !typeData.title?.trim() ? "Campo obrigatório" : undefined,
          label: !typeData.label?.trim() ? "Campo obrigatório" : undefined,
        },
      };
    }

    const formattedTitle = typeData.title.trim();
    const formattedLabel = typeData.label.trim().toUpperCase();

    const existingType = await db.schedulingType.findFirst({
      where: {
        OR: [{ title: formattedTitle }, { label: formattedLabel }],
      },
    });

    if (existingType) {
      if (existingType.title === formattedTitle) {
        return {
          success: false,
          message: `Já existe um tipo com o título "${formattedTitle}"`,
          errors: {
            title: `O título "${formattedTitle}" já está em uso`,
          },
        };
      } else {
        return {
          success: false,
          message: `Já existe um tipo com a abreviação "${formattedLabel}"`,
          errors: {
            label: `A abreviação "${formattedLabel}" já está em uso`,
          },
        };
      }
    }

    const newType = await db.schedulingType.create({
      data: {
        title: formattedTitle,
        label: formattedLabel,
      },
    });

    return {
      success: true,
      data: newType,
      message: "Tipo criado com sucesso!",
    };
  } catch (error: any) {
    console.error("Erro ao criar tipo:", error);

    if (error.code === "P2002") {
      const target = error.meta?.target?.[0];
      let message = "Erro de duplicidade";

      if (target === "title") {
        message = `Já existe um tipo com o título "${typeData.title.trim()}"`;
      } else if (target === "label") {
        message = `Já existe um tipo com a abreviação "${typeData.label.trim().toUpperCase()}"`;
      }

      return {
        success: false,
        message,
        errors: {
          [target]: message,
        },
      };
    }

    return {
      success: false,
      message: "Erro inesperado ao criar tipo. Tente novamente.",
    };
  }
}
