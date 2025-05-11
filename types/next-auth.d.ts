import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      username: string;
    } & DefaultSession['user'];
  }

declare module "next-auth/adapters" {
  interface AdapterUser {
    id: number;
    username: string;
    email: string;
    emailVerified: Date | null;
    password: string;
  }
}
  
  interface User extends DefaultUser {
    id: number;
    username: string;
  }
}
