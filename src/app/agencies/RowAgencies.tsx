import { DateTime } from 'luxon';
import Link from 'next/link';
import { FaBuilding, FaMotorcycle } from 'react-icons/fa';

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
      <td className='flex'>
        <Link href={`/agencias/${values.id}/motorizados`}>
          <a className='btn btn-primary btn-sm mr-2'>
            <FaMotorcycle />
          </a>
        </Link>
        <Link href={`/agencias/${values.id}/agentes`}>
          <a className='btn btn-secondary btn-sm '>
            <FaBuilding />
          </a>
        </Link>
      </td>
    </tr>
  );
};
