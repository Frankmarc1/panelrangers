import { Motorized } from '../../types/motorized';
import { DateTime } from 'luxon';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useState } from 'react';

import { subscribeMotorized } from './helpers/subscribeMotorized';

export const RowSubs = ({ values }: { values: Motorized }) => {
  const [loading, setLoading] = useState(false);

  const handleMove = async (id: string) => {
    setLoading(true);
    await subscribeMotorized(id);

    toast.success('Subscripctor aceptado con exito.');

    setLoading(false);
  };

  return (
    <tr>
      <td> {values.profile.dni} </td>
      <td> {values.phone} </td>
      <td>
        {values.profile.name} {values.profile.lastName}
      </td>
      <td> {values.activo ? 'Completados' : 'Sin completar'} </td>
      <td>
        {' '}
        {DateTime.fromSeconds(values.timeUp.seconds).toFormat(
          'dd/MM/yyyy'
        )}{' '}
      </td>
      <td className=''>
        {loading ? (
          <button className='btn btn-ghost btn-sm loading'></button>
        ) : (
          <button
            className='btn btn-success btn-sm'
            onClick={() => handleMove(values.id)}
          >
            <FaArrowAltCircleLeft />
          </button>
        )}
      </td>
    </tr>
  );
};
