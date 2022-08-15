import { Motorized } from '../../types/motorized';
import { DateTime } from 'luxon';
import { FaPen, FaUserAltSlash } from 'react-icons/fa';

export const RowMotorized = ({ values }: { values: Motorized }) => {
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
        <button className='btn btn-success btn-sm mr-3'>
          <FaPen />
        </button>

        <button className='btn btn-error btn-sm'>
          <FaUserAltSlash />
        </button>
      </td>
    </tr>
  );
};
