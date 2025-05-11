import NextAuth, { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      username: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string
    username: string
  }

  interface JWT {
    id: string
    username: string
  }
}
