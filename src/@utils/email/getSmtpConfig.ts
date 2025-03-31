"use server";

import db from "@/lib/db";
import { Message } from "@/@types/message";
import { Smtp } from "@/@types/smtp";

export async function getSmtpConfig(): Promise<Smtp | Message> {
  try {
    const smtpConfig = await db.smtpConfig.findFirst();

    if (!smtpConfig) {
      return null;
    }

    return {
      host: smtpConfig.host || "",
      port: Number(smtpConfig.port),
      password: smtpConfig.password.toString() || "",
      fromAddress: smtpConfig.fromAddress || "",
      fromName: smtpConfig.fromName || "",
    };
  } catch (error) {
    return { success: false, message: "Erro ao buscar dados" };
  }
}
