import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';

export function useSessionUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getSession().then(session => {
      if (session?.user) {
        setUser(session.user);
      }
    });
  }, []);

  return user;
}
