"use server";

import db from "@/lib/db";

export async function registerCity(cityData: { name: string; label: string }) {
  try {
    if (!cityData.name?.trim() || !cityData.label?.trim()) {
      return {
        success: false,
        message: "Preencha todos os campos obrigatórios",
        errors: {
          name: !cityData.name?.trim() ? "Campo obrigatório" : undefined,
          label: !cityData.label?.trim() ? "Campo obrigatório" : undefined,
        },
      };
    }

    const formattedName = cityData.name.trim();
    const formattedLabel = cityData.label.trim();

    const existingCity = await db.city.findFirst({
      where: {
        OR: [{ name: formattedName }, { label: formattedLabel }],
      },
    });

    if (existingCity) {
      if (existingCity.name === formattedName) {
        return {
          success: false,
          message: `Já existe uma cidade com o nome "${formattedName}"`,
          errors: {
            name: `O nome "${formattedName}" já está em uso`,
          },
        };
      } else {
        return {
          success: false,
          message: `Já existe uma cidade com a descrição "${formattedLabel}"`,
          errors: {
            label: `A descrição "${formattedLabel}" já está em uso`,
          },
        };
      }
    }

    const newCity = await db.city.create({
      data: {
        name: formattedName,
        label: formattedLabel,
        active: true,
      },
    });

    return {
      success: true,
      data: newCity,
      message: "Cidade criada com sucesso!",
    };
  } catch (error: any) {
    console.error("Erro ao criar cidade:", error);

    if (error.code === "P2002") {
      const target = error.meta?.target?.[0];
      let message = "Erro de duplicidade";

      if (target === "name") {
        message = `Já existe uma cidade com o nome "${cityData.name.trim()}"`;
      } else if (target === "label") {
        message = `Já existe uma cidade com a descrição "${cityData.label.trim()}"`;
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
      message: "Erro inesperado ao criar cidade. Tente novamente.",
    };
  }
}
