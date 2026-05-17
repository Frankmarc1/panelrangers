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
  const docMotorized = doc(db_client, `users_motorizados/${id}`);

  try {
    const snapSubs = await getDoc(docSubs);

    if (!snapSubs.exists()) {
      toast.error('No existe la subscripción seleccionada.');
      return false;
    }

    const subsData = snapSubs.data();

    const accountQuery = query(
      collection(db_client, 'accounts/rangers/account'),
      where('referenceProfile', '==', docSubs)
    );

    const snapAccount = await getDocs(accountQuery);

    if (snapAccount.empty) {
      toast.error('No existe una cuenta asociada a este motorizado.');
      return false;
    }

    /**
     * 1. Primero intenta actualizar la cuenta.
     * Si aquí falla por permisos, no crea nada más.
     */
    try {
      for (const accountDoc of snapAccount.docs) {
        await updateDoc(accountDoc.ref, {
          referenceProfile: docMotorized,
        });
      }

      console.log('✅ Cuenta actualizada correctamente');
    } catch (error) {
      console.error('❌ Error actualizando cuenta:', error);
      toast.error('Sin permiso para actualizar la cuenta.');
      return false;
    }

    /**
     * 2. Luego crea/migra al motorizado.
     */
    try {
      await setDoc(docMotorized, {
        ...subsData,
        id,
        thisRef: docMotorized,
        status: 'ENABLED',
      });

      console.log('✅ Motorizado creado correctamente');
    } catch (error) {
      console.error('❌ Error creando motorizado:', error);
      toast.error('Sin permiso para crear el motorizado.');
      return false;
    }

    /**
     * 3. Finalmente elimina la suscripción.
     */
    try {
      await deleteDoc(docSubs);

      console.log('✅ Subscripción eliminada correctamente');
    } catch (error) {
      console.error('❌ Error eliminando subscripción:', error);
      toast.error('Motorizado creado, pero no se pudo eliminar la subscripción.');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error general al completar subscripción:', error);
    toast.error('No se pudo completar la subscripción.');
    return false;
  }
};