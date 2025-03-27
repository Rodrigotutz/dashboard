import { createTransport } from "nodemailer";
import { render } from "@react-email/render";
import React from "react";
import { getSmtpConfig } from "@/utils/email/getSmtpConfig";

interface SmtpConfig {
  host: string;
  port: number;
  fromAddress: string;
  fromName: string;
  password: string;
}

export class SendEmail {
  private smtpConfig: SmtpConfig;

  private constructor(smtpConfig: SmtpConfig) {
    if (!smtpConfig?.host || !smtpConfig?.port) {
      throw new Error(
        "Configuração SMTP inválida: host e port são obrigatórios"
      );
    }
    this.smtpConfig = smtpConfig;
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    text?: string
  ): Promise<void> {
    try {
      const transporter = createTransport({
        host: this.smtpConfig.host,
        port: this.smtpConfig.port,
        secure: this.smtpConfig.port === 465,
        auth: {
          user: this.smtpConfig.fromAddress,
          pass: this.smtpConfig.password,
        },
      });

      const response = await transporter.sendMail({
        from: {
          address: this.smtpConfig.fromAddress,
          name: this.smtpConfig.fromName,
        },
        to: to,
        subject: subject,
        html: html,
        text: text,
      });

      const failed = response.rejected.concat(response.pending).filter(Boolean);
      if (failed.length) {
        throw new Error(`Email (${failed.join(", ")}) não pode ser enviado`);
      }
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      throw new Error("Falha ao enviar email");
    }
  }

  async getHtml(element: React.ReactElement): Promise<string> {
    return render(element);
  }

  static async create(): Promise<SendEmail> {
    try {
      const smtpConfig = await getSmtpConfig();

      if (!smtpConfig || "success" in smtpConfig) {
        throw new Error(
          smtpConfig?.message || "Configurações SMTP não encontradas"
        );
      }

      return new SendEmail({
        host: smtpConfig.host,
        port: smtpConfig.port,
        fromAddress: smtpConfig.fromAddress,
        fromName: smtpConfig.fromName,
        password: smtpConfig.password,
      });
    } catch (error) {
      console.error("Erro ao criar SendEmail:", error);
      throw new Error("Falha ao inicializar serviço de email");
    }
  }
}
