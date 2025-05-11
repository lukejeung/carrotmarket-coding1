import NextAuth, { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      username: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: number
    username: string
  }

  interface JWT {
    id: number
    username: string
  }
}
