import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function middleware(req: NextRequest) {
  const session = await auth();

  const loginPage = req.nextUrl.pathname === "/";
  const dashboardPage = req.nextUrl.pathname.startsWith("/dashboard");
  const chatPage = req.nextUrl.pathname.startsWith("/chat");
  const settingsPage = req.nextUrl.pathname.startsWith("/dashboard/definicoes");

  if (!session && (dashboardPage || chatPage)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (session && loginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (session && session.user.type !== "admin" && settingsPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/chat/:path*"],
};
