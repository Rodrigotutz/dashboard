"use server";

import db from "@/lib/db";
import { Smtp } from "@/@types/smtp";
import { hashSync } from "bcrypt-ts";

export default async function registerSmtp(formData: FormData) {
  const entries = Array.from(formData.entries());

  const data = Object.fromEntries(entries) as {
    host: string;
    port: string;
    password: string;
    fromName: string;
    fromAddress: string;
  };

  if (
    !data.host ||
    !data.port ||
    !data.fromName ||
    !data.fromAddress ||
    !data.password
  ) {
    return { success: false, message: "Preencha todos os campos" };
  }

  try {
    await db.smtpConfig.upsert({
      where: { fromAddress: data.fromAddress },
      update: {
        host: data.host,
        port: Number(data.port),
        fromAddress: data.fromAddress,
        fromName: data.fromName,
        password: data.password,
      },
      create: {
        host: data.host,
        port: Number(data.port),
        fromAddress: data.fromAddress,
        fromName: data.fromName,
        password: data.password,
      },
    });

    return { success: true, message: "Dados SMTP salvos com sucesso" };
  } catch (err: any) {
    return { success: true, message: err.message };
  }
}
