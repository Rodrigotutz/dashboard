import { Session } from "@/@interfaces/session";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = (await auth()) as Session;
  return NextResponse.json(session);
}
