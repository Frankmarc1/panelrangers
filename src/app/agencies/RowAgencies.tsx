import { DateTime } from 'luxon';
import Link from 'next/link';
import { FaMotorcycle } from 'react-icons/fa';

import { Agency } from '../../types/agency';

export const RowAgencies = ({ values }: { values: Agency }) => {
  return (
    <tr>
      <td> {values.nombre} </td>
      <td> {values.departamento} </td>
      <td>{values.direccion}</td>
      <td> {values.estado ? 'Activo' : 'Inactivo'} </td>
      <td>
        {' '}
        {DateTime.fromSeconds(values.fecha_registro.seconds).toFormat(
          'dd/MM/yyyy'
        )}{' '}
      </td>
      <td>
        <Link href={`/dashboard/agencias/${values.id}/motorizados`}>
          <a className='btn btn-primary btn-sm text-lg'>
            <FaMotorcycle />
          </a>
        </Link>
      </td>
    </tr>
  );
};
