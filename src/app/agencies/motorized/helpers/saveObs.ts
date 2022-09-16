import { doc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db_client } from '../../../../firebase/client';

export const saveObs = async (
  value: string,
  idMotorized: string,
  idReporte: string
) => {
  await updateDoc(
    doc(
      db_client,
      `users_motorizados/${idMotorized}/agencia_reporte_pedidos/${idReporte}`
    ),
    {
      observacion: value.trim(),
    }
  );

  toast.success('Observación registrada con exito');
};
