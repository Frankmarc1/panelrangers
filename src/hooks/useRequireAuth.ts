import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { auth_client } from '../firebase/client';

export const useRequireAuth = () => {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth_client, (user) => {
      if (!user) {
        router.replace('/ingresar');
        return;
      }

      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  return {
    checkingAuth,
  };
};