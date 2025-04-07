import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { findUserByCredentials, findUserByEmail } from "./lib/user";
import db from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await findUserByCredentials(
          credentials.email as string,
          credentials.password as string
        );
        return user;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/calendar",
        },
      },
    }),

  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const email = profile?.email;
        const name = profile?.name;

        if (!email) return "/cadastrar?error=usuario_nao_encontrado";

        const user = await findUserByEmail(email);

        if (!user) {
          return `/cadastrar?error=usuario_nao_encontrado&name=${encodeURIComponent(name || "")}&email=${encodeURIComponent(email)}`;
        }

        await db.user.update({
          where: { email },
          data: {
            googleAccessToken: account.access_token,
            googleRefreshToken: account.refresh_token,
            googleTokenExpiry: account.expires_at!,
          },
        });

        (account as any).user = {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          type: user.type,
          createdAt: new Date(user.createdAt).toISOString(),
        };
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        const customUser = user as {
          id: string;
          name: string;
          email: string;
          type: string;
          createdAt: string;
        };

        token.id = customUser.id;
        token.name = customUser.name;
        token.email = customUser.email;
        token.type = customUser.type as "user" | "admin";
        token.createdAt = customUser.createdAt;
      }

      if (account) {
        if (account.access_token) {
          token.accessToken = account.access_token;
        }
        if (account.refresh_token) {
          token.refreshToken = account.refresh_token;
        }
        if (account.expires_at) {
          token.expiresAt = account.expires_at;
        }

        if ((account as any).user) {
          const accUser = (account as any).user;
          token.id = accUser.id;
          token.name = accUser.name;
          token.email = accUser.email;
          token.type = accUser.type;
          token.createdAt = accUser.createdAt;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;

      if (token.type === 'admin' || token.type === 'user') {
        session.user.type = token.type;
      }

      session.user.createdAt = token.createdAt as string;

      session.accessToken = token.accessToken as string;

      return session;
    }

  },
});
