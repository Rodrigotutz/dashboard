import { SendEmail } from "@/lib/SendEmail";
import PasswordReset from "@/packages/transactional/emails/ResetPassword";
import os from "os";

export class ResetPassword {
  private getLocalIpAddress(): string {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
      const interfaceInfo = interfaces[interfaceName];
      if (interfaceInfo) {
        for (const iface of interfaceInfo) {
          if (iface.family === "IPv4" && !iface.internal) {
            return iface.address;
          }
        }
      }
    }
    return "localhost";
  }

  private getBaseUrl(): string {
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    }

    if (process.env.NEXT_PUBLIC_SITE_URL) {
      return process.env.NEXT_PUBLIC_SITE_URL;
    }

    if (process.env.NODE_ENV === "development") {
      const ip = this.getLocalIpAddress();
      return `http://${ip}:3000`;
    }

    return "http://localhost:3000";
  }

  async execute(username: string, email: string, resetToken?: string) {
    const sendEmail = new SendEmail();
    const baseUrl = this.getBaseUrl();
    const resetLink = `${baseUrl}/alterar/${resetToken}`;

    const html = await sendEmail.getHtml(
      PasswordReset({
        username: username,
        resetLink: resetLink,
      })
    );

    await sendEmail.sendEmail(email, "Altere sua senha", html);
  }
}
