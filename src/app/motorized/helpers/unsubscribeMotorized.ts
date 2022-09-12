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

export const unsubscribeMotorized = async (id: string) => {
  const docRef = doc(db_client, `/users_motorizados/${id}`);
  const docSubs = doc(collection(db_client, 'suscripciones'));

  try {
    const snap = await getDoc(docRef);
    const q = query(
      collection(db_client, '/accounts/rangers/account'),
      where('reference', '==', docRef)
    );
    const snapQ = await getDocs(q);

    await updateDoc(snapQ.docs[0].ref, {
      reference: docSubs,
    });
    await setDoc(docSubs, {
      ...snap.data(),
      id: docSubs.id,
    });
    await deleteDoc(docRef);

    toast.success('Motorizado desubscrito con exito.');
  } catch (err) {
    console.error(err);
  }
};
