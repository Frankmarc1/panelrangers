import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaPen, FaTrash } from 'react-icons/fa';
import { InlineInput } from '../../components/Inputs/InlineInput';
import { db_client } from '../../firebase/client';
import { Rol } from '../../types/rol';
import { showAlertDeleteRol } from './helpers/deleteRol';
import { editRol } from './helpers/editRol';
import { isValidName } from './helpers/saveRol';

export const RowRol = ({ values }: { values: Rol }) => {
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const onSave = async (value: string) => {
    if (!isValidName(value)) {
      toast.error('Nombre no es valido');

      return;
    }

    try {
      await editRol(value, values.id);
      toast.success('Rol editado con exito');
    } catch {
      toast.error('Error al actualizar el nombre.');
    }
  };

  useEffect(() => {
    getDocs(
      query(
        collection(db_client, 'rangers_masters'),
        where('reference_rol', '==', doc(db_client, `roles/${values.id}`))
      )
    ).then((snap) => {
      setTotal(snap.size);
      setLoading(false);
    });
  }, []);

  return (
    <tr>
      <td>
        <InlineInput value={values.name} onSave={onSave} />
      </td>
      <td>
        {loading ? (
          <button className='btn btn-sm btn-ghost loading'></button>
        ) : (
          total
        )}
      </td>
      <td>
        <button
          className='btn btn-sm btn-error'
          onClick={() => showAlertDeleteRol(values.id)}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
};
