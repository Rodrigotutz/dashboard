import { createTransport } from "nodemailer";
import { render } from "@react-email/render";
import React from "react";
import db from "@/lib/db";

export class SendEmail {
  private smtpConfig: {
    host: string;
    port: number;
    fromAddress: string;
    fromName: string;
    password: string;
  };

  constructor(smtpConfig?: {
    host: string;
    port: number;
    fromAddress: string;
    fromName: string;
    password: string;
  }) {
    this.smtpConfig = smtpConfig || {
      host: process.env.EMAIL_SERVER_HOST!,
      port: Number(process.env.EMAIL_SERVER_PORT),
      fromAddress: process.env.EMAIL_SERVER_FROM_ADDRESS!,
      fromName: process.env.EMAIL_SERVER_FROM_NAME!,
      password: process.env.EMAIL_SERVER_PASSWORD!,
    };
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    text?: string
  ): Promise<void> {
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
  }

  async getHtml(element: React.ReactElement): Promise<string> {
    return render(element);
  }

  static async createFromDatabase() {
    const smtpConfig = await db.smtpConfig.findFirst();

    if (!smtpConfig) {
      throw new Error("Configurações SMTP não encontradas no banco de dados");
    }

    return new SendEmail({
      host: smtpConfig.host,
      port: smtpConfig.port,
      fromAddress: smtpConfig.fromAddress,
      fromName: smtpConfig.fromName,
      password: smtpConfig.password,
    });
  }
}
