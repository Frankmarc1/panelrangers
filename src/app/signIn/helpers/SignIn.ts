import jwt from 'jsonwebtoken';
import jsCookie from 'js-cookie';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

import { auth_client, db_client } from '../../../firebase/client';

export const handleSignIn = async (
  email: string,
  pasword: string
): Promise<boolean> => {
  try {
    const response = await signInWithEmailAndPassword(
      auth_client,
      email,
      pasword
    );
    const uid = response.user.uid;
    const docAccount = doc(db_client, `rangers_masters/${uid}`);
    const snap = await getDoc(docAccount);

    if (!snap.exists()) {
      toast.error('usuario no es un rangers master');
      return false;
    }

    let token = jwt.sign({ uid }, 'rvs');

    jsCookie.set('token', token);

    return true;
  } catch (err) {
    throw err;
  }
};
