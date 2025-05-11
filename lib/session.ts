import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from '@/lib/db'
import GitHubProvider from 'next-auth/providers/github'
import { type NextAuthOptions, getServerSession } from 'next-auth'
import { AdapterUser } from "next-auth/adapters";

// 여기서 `Session` 타입을 확장합니다.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        if ("username" in user) {
    token.username = (user as AdapterUser).username; // AdapterUser 타입으로 강제 변환
  }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = Number(token.id);
        session.user.username = token.username as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export async function getSession() {
  return await getServerSession(authOptions)
}
