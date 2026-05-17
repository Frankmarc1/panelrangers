import { useState } from 'react';
import { DateTime } from 'luxon';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { Motorized } from '../../types/motorized';
import { subscribeMotorized } from './helpers/subscribeMotorized';

export const RowSubs = ({ values }: { values: Motorized }) => {
  const [loading, setLoading] = useState(false);

  const handleMove = async (id: string) => {
  try {
    setLoading(true);

    const migrated = await subscribeMotorized(id);

    if (!migrated) return;

    toast.success('Suscriptor aceptado con éxito.');
  } catch (error) {
    console.error(error);
    toast.error('No se pudo aceptar la subscripción.');
  } finally {
    setLoading(false);
  }
};

  return (
    <tr>
      <td>{values.profile?.dni}</td>

      <td>{values.phone}</td>

      <td>
        {values.profile?.name} {values.profile?.lastName}
      </td>

      <td>{values.activo ? 'Completados' : 'Sin completar'}</td>

      <td>
        {values.timeUp?.seconds
          ? DateTime.fromSeconds(values.timeUp.seconds).toFormat('dd/MM/yyyy')
          : '-'}
      </td>

      <td>
        {loading ? (
          <button className='btn btn-ghost btn-sm loading'></button>
        ) : (
          <button
            className='btn btn-success btn-sm'
            onClick={() => handleMove(values.id)}
            title='Aceptar suscriptor'
          >
            <FaArrowAltCircleLeft />
          </button>
        )}
      </td>
    </tr>
  );
};