import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { DateTime } from 'luxon';
import toast from 'react-hot-toast';
import { db_client } from '../../../../firebase/client';
import { Motorized } from '../../../../types/motorized';

export const createReport = async (
  idMotorized: string,
  withOrders: boolean
) => {
  try {
    const snap = await getDoc(
      doc(db_client, `/users_motorizados/${idMotorized}`)
    );
    const { porcentaje = 0 } = snap.data() as Motorized;
    const nameReport = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss');
    const ref = doc(
      collection(
        db_client,
        `users_motorizados/${idMotorized}/agencia_reporte_pedidos/`
      )
    );
    const obj = {
      descuentos: 0,
      deuda: 0,
      estado: 'PENDIENTE',
      fecha_registro: serverTimestamp(),
      nombreReporte: nameReport,
      pago: 0,
      porcentaje,
      totalIncentivo: 0,
      idReporte: ref.id,
    };

    await setDoc(ref, obj);

    if (withOrders) {
      const colRef = collection(
        db_client,
        `users_motorizados/${idMotorized}/pedidos_agencia`
      );

      const snap = await getDocs(colRef);

      snap.forEach(async (docSnap) => {
        const { valorDelivery, valordescuento = 0 } = docSnap.data();
        const docRef = doc(
          collection(
            db_client,
            `users_motorizados/${idMotorized}/agencia_reporte_pedidos/${ref.id}/agencia_pedidos_reportados`
          )
        );

        await setDoc(docRef, {
          ...docSnap.data(),
          id: docRef.id,
          idReporte: ref,
        });
        await updateDoc(ref, {
          deuda: increment(valorDelivery),
          descuentos: increment(valordescuento),
          totalReporte: increment(valorDelivery),
        });
        await deleteDoc(docSnap.ref);
      });

      await updateDoc(ref, {
        cantidad_pedidos: snap.size,
        totalIncentivo: 0,
      });
    }

    toast.success(`Reporte ${nameReport} creado correctamente.`);
  } catch (err) {
    throw err;
  }
};
