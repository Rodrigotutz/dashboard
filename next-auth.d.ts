import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      type: "admin" | "user";
      createdAt: string;
    } & DefaultSession["user"];

    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    type: "admin" | "user";
    createdAt: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends Record<string, unknown> {
    id: string;
    name: string;
    email: string;
    type: "admin" | "user";
    createdAt: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }
}
