import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db_client } from '../../../firebase/client';

export const subscribeMotorized = async (id: string) => {
  const docSubs = doc(db_client, `suscripciones/${id}`);
  const colAccount = query(
    collection(db_client, '/accounts/rangers/account'),
    where('reference', '==', docSubs)
  );
  const docMotorized = doc(db_client, `users_motorizados/${id}`);
  const snapSubs = await getDoc(docSubs);
  const snapAccount = await getDocs(colAccount);

  if (snapAccount.empty) {
    toast.error('No existe una cuenta asociada a este motorizado.');
    return;
  }

  snapAccount.forEach(async (doc) => {
    await updateDoc(doc.ref, {
      reference: docMotorized,
    });
  });

  await setDoc(docMotorized, {
    ...snapSubs.data(),
  });

	await deleteDoc(docSubs)
};
