import { SendEmail } from "@/lib/SendEmail";
import { RegisterEmailConfirm } from "transactional/emails/RegisterConfirm";

export class ConfirmRegisterEmail {
  async execute(username: string, email: string, confirmCode?: string) {
    const sendEmail = new SendEmail();
    const html = await sendEmail.getHtml(
      RegisterEmailConfirm({
        username: username,
        email: email,
        confirmCode: confirmCode,
      })
    );
    await sendEmail.sendEmail(email, "Confirme seu email", html);
  }
}
