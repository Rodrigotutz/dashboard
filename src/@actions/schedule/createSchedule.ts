"use server";
import db from "@/lib/db";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

export async function createSchedule(scheduleData: {
  typeId: number;
  userId: number;
  cityId: number;
  description: string;
  scheduledDate: Date;
}) {
  try {
    const newSchedule = await db.schedule.create({
      data: {
        typeId: scheduleData.typeId,
        userId: scheduleData.userId,
        cityId: scheduleData.cityId,
        description: scheduleData.description.trim(),
        scheduledDate: scheduleData.scheduledDate,
        status: "pending",
      },
      include: {
        user: {
          select: {
            id: true,
            googleAccessToken: true,
            googleRefreshToken: true,
            googleTokenExpiry: true,
          },
        },
        city: true,
        type: true,
      },
    });

    if (newSchedule.user?.googleAccessToken) {
      const oauth2Client = new OAuth2Client(
        process.env.AUTH_GOOGLE_ID,
        process.env.AUTH_GOOGLE_SECRET
      );

      const expiryDate = newSchedule.user.googleTokenExpiry ?
        Number(newSchedule.user.googleTokenExpiry) :
        undefined;

      oauth2Client.setCredentials({
        access_token: newSchedule.user.googleAccessToken,
        refresh_token: newSchedule.user.googleRefreshToken || undefined,
        expiry_date: expiryDate,
      });

      const isTokenExpired = () => {
        if (!oauth2Client.credentials.expiry_date) return false;
        return oauth2Client.credentials.expiry_date < Date.now();
      };

      if (isTokenExpired()) {
        const { credentials } = await oauth2Client.refreshAccessToken();

        const expiryBigInt = credentials.expiry_date ?
          BigInt(credentials.expiry_date) :
          null;

        await db.user.update({
          where: { id: newSchedule.user.id },
          data: {
            googleAccessToken: credentials.access_token,
            googleRefreshToken: credentials.refresh_token || newSchedule.user.googleRefreshToken,
            googleTokenExpiry: expiryBigInt,
          },
        });

        oauth2Client.setCredentials(credentials);
      }

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      const event = {
        summary: `${newSchedule.type.title} - ${newSchedule.city.name}`,
        start: {
          dateTime: newSchedule.scheduledDate.toISOString(),
          timeZone: "America/Sao_Paulo",
        },
        end: {
          dateTime: new Date(newSchedule.scheduledDate.getTime() + 3600000).toISOString(),
          timeZone: "America/Sao_Paulo",
        },
      };

      const googleEvent = await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
      });

      await db.schedule.update({
        where: { id: newSchedule.id },
        data: {
          googleEventId: googleEvent.data.id,
        },
      });
    }

    return { success: true, id: newSchedule.id };
  } catch (error: any) {
    console.error("Erro ao criar agendamento:", error);
    return { success: false, message: error.message };
  }
}