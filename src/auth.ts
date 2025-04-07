import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { findUserByCredentials, findUserByEmail } from "./lib/user";

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
          const redirectUrl = `/cadastrar?error=usuario_nao_encontrado&name=${encodeURIComponent(name || "")}&email=${encodeURIComponent(email)}`;
          return redirectUrl;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      if (token?.type && (token.type === "admin" || token.type === "user")) {
        session.user.type = token.type;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.type = user.type;
      }
      return token;
    },
  }

});
