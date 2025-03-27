"use server"

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function registerLike(tipId: number, type: string) {

    try {
        if (!tipId || (type !== "like" && type !== "dislike")) {
            return { success: false, message: "Tente novamente mais tarde" };
        }

        const updatedTip = await db.tips.update({
            where: { id: Number(tipId) },
            data: {
                [type === "like" ? "likes" : "dislikes"]: {
                    increment: 1,
                },
            },
        });

        revalidatePath("/tips");
        return { success: true, message: "Atualizado com sucesso", data: updatedTip };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
