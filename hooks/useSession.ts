import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { DefaultUser } from "next-auth"; // 타입 가져오기

export function useSessionUser() {
  const [user, setUser] = useState<DefaultUser | null>(null);

  useEffect(() => {
    getSession().then((session) => {
      if (session?.user) {
        setUser(session.user);
      }
    });
  }, []);

  return user;
}
