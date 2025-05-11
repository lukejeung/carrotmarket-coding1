import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Session } from "next-auth"; // 타입 임포트 필요

export function useSessionUser() {
  const [user, setUser] = useState<Session["user"] | null>(null); // ✅ 여기를 수정

  useEffect(() => {
    getSession().then((session) => {
      if (session?.user) {
        setUser(session.user);
      }
    });
  }, []);

  return user;
}
