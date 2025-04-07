import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { token, event } = await req.json();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: token });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: event.title,
        description: event.description,
        start: {
          dateTime: event.start,
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: event.end,
          timeZone: 'America/Sao_Paulo',
        },
      },
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Erro ao criar evento no Google Calendar:', error);
    return NextResponse.json({ success: false, error: 'Erro ao criar evento' }, { status: 500 });
  }
}
