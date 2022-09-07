import { deleteDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { db_client } from '../../../firebase/client';

export const deleteRol = async (id: string) => {
  try {
    await deleteDoc(doc(db_client, `roles/${id}`));
  } catch (err) {
    throw err;
  }
};

export const showAlertDeleteRol = (id: string) => {
  Swal.fire({
    title: '¿Esta seguro?',
    text: '¡No podrás revertir esto!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '¡Sí, bórralo!',
    cancelButtonText: 'Cancelar',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteRol(id);
        toast.success('Rol eliminado');
      } catch {
        toast.error('Rol no existe, recargue la pagina');
      }
    }
  });
};
