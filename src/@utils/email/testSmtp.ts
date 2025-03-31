"use server";
import nodemailer from "nodemailer";

export async function testSmtpConnection(config: {
  host: string;
  port: number;
  fromAddress: string;
  password: string;
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: Number(config.port),
      secure: config.port === 465,
      auth: {
        user: config.fromAddress,
        pass: config.password,
      },
    });

    await transporter.verify();

    return { success: true, message: "Conexão SMTP bem-sucedida!" };
  } catch (error: any) {
    console.error("Erro ao testar SMTP:", error);
    return {
      success: false,
      message: "Falha ao conectar ao servidor SMTP!",
    };
  }
}
