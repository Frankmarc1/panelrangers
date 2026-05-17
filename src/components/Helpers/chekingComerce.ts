import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';

import { db_client } from '../../firebase/client';

export const checkingCommerce = async (path: string, status: boolean) => {
  try {
    /**
     * Si status es false, significa que se está desactivando la tienda.
     * Para desactivar NO se debe validar productos.
     */
    if (status === false) {
      await updateDoc(doc(db_client, path), {
        status: false,
      });

      toast.success('Tienda desactivada correctamente');
      return;
    }

    /**
     * Si status es true, significa que se está intentando activar la tienda.
     * Para activar debe existir al menos 1 producto validado/aprobado.
     */
    const productsRef = collection(db_client, `${path}/productos`);

    const approvedByValidationStatusSnap = await getDocs(
      query(
        productsRef,
        where('validationStatus', '==', 'APPROVED'),
        limit(1)
      )
    );

    const hasApprovedByValidationStatus = !approvedByValidationStatusSnap.empty;

    if (hasApprovedByValidationStatus) {
      await updateDoc(doc(db_client, path), {
        status: true,
      });

      toast.success('Tienda activada correctamente');
      return;
    }

    /**
     * Compatibilidad con productos antiguos:
     * Si todavía tienes productos que solo usan status: true,
     * también los aceptamos como productos válidos.
     */
    const approvedByStatusSnap = await getDocs(
      query(
        productsRef,
        where('status', '==', true),
        limit(1)
      )
    );

    const hasApprovedByStatus = !approvedByStatusSnap.empty;

    if (hasApprovedByStatus) {
      await updateDoc(doc(db_client, path), {
        status: true,
      });

      toast.success('Tienda activada correctamente');
      return;
    }

    toast.error('Para activar la tienda, primero aprueba al menos 1 producto.');
  } catch (err) {
    console.error('CHECKING_COMMERCE_ERROR:', err);
    toast.error('No se pudo actualizar el estado de la tienda.');
  }
};