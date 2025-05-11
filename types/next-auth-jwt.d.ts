import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: number;
    username: string;
  }
}
