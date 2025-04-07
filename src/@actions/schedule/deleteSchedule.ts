"use server";
import db from "@/lib/db";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

export async function deleteSchedule(id: number) {
  try {
    const schedule = await db.schedule.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            googleAccessToken: true,
            googleRefreshToken: true,
            googleTokenExpiry: true,
          },
        },
      },
    });

    if (!schedule) {
      return { success: false, message: "Agendamento não encontrado" };
    }

    if (schedule.googleEventId && schedule.user?.googleAccessToken) {
      try {
        const oauth2Client = new OAuth2Client(
          process.env.AUTH_GOOGLE_ID,
          process.env.AUTH_GOOGLE_SECRET
        );

        // Converte BigInt para number ao configurar as credenciais
        const expiryDate = schedule.user.googleTokenExpiry ?
          Number(schedule.user.googleTokenExpiry) :
          undefined;

        oauth2Client.setCredentials({
          access_token: schedule.user.googleAccessToken,
          refresh_token: schedule.user.googleRefreshToken || undefined,
          expiry_date: expiryDate,
        });

        // Verifica se o token está expirado
        const isTokenExpired = () => {
          if (!oauth2Client.credentials.expiry_date) return false;
          return oauth2Client.credentials.expiry_date < Date.now();
        };

        if (isTokenExpired()) {
          const { credentials } = await oauth2Client.refreshAccessToken();

          // Converte para BigInt ao salvar no banco
          const expiryBigInt = credentials.expiry_date ?
            BigInt(credentials.expiry_date) :
            null;

          await db.user.update({
            where: { id: schedule.user.id },
            data: {
              googleAccessToken: credentials.access_token,
              googleRefreshToken: credentials.refresh_token || schedule.user.googleRefreshToken,
              googleTokenExpiry: expiryBigInt,
            },
          });

          oauth2Client.setCredentials(credentials);
        }

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        await calendar.events.delete({
          calendarId: "primary",
          eventId: schedule.googleEventId,
        });
      } catch (googleError) {
        console.error("Erro ao deletar do Google Agenda:", googleError);
      }
    }

    await db.schedule.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir agendamento:", error);
    return { success: false, message: "Erro na exclusão" };
  }
}