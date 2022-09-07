import { doc, getDoc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db_client } from '../../../firebase/client';

export const editRol = async (value: string, id: string) => {
  const docRef = doc(db_client, `roles/${id}`);

  try {
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      toast.error('Rol no esta registrado');
      return;
    }

    await updateDoc(docRef, {
      name: value.toUpperCase(),
    });
  } catch (err) {
    throw err;
  }
};
