import { doc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { db_client } from '../../../firebase/client';

export const deleteMotorized = (id: string, name: string) => {
  const docSnap = doc(db_client, `users_motorizados/${id}`);

  Swal.fire({
    title: `¿Esta seguro que desea eliminar a ${name}?`,
    text: 'Pulse eliminar, para continuar',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      await updateDoc(docSnap, { status: 'ELIMINADO' });

      toast.success('Motorizado eliminado con exito.');
    }
  });
};
