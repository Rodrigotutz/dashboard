import { SendEmail } from "@/lib/SendEmail";
import { RegisterEmailConfirm } from "transactional/emails/RegisterConfirm";

export class ConfirmRegisterEmail {
  async execute(username: string, email: string, confirmCode?: string) {
    try {
      const sendEmail = await SendEmail.create();

      const html = await sendEmail.getHtml(
        RegisterEmailConfirm({
          username: username,
          email: email,
          confirmCode: confirmCode,
        }),
      );

      await sendEmail.sendEmail(email, "Confirme seu email", html);
    } catch (error) {
      console.error("Erro ao enviar email de confirmação:", error);
      throw new Error("Falha ao enviar email de caonfirmação");
    }
  }
}
