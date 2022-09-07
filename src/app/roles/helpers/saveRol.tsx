import { collection, doc, setDoc } from 'firebase/firestore';
import { db_client } from '../../../firebase/client';

export const saveRol = async (name: string) => {
  try {
    const docRef = doc(collection(db_client, 'roles'));

    await setDoc(docRef, {
      id: docRef.id,
      name: name.toUpperCase(),
    });
  } catch (err) {
    throw err;
  }
};

export const isValidName = (name: string): boolean => {
  let tmpName = name.trim();

  if (tmpName.length < 3) return false;
  if (tmpName.match(/[0-9]/)) return false;

  return true;
};
