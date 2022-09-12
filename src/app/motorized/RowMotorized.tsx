import { Motorized } from '../../types/motorized';
import { DateTime } from 'luxon';
import { FaArrowRight, FaPen, FaUserAltSlash } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import Link from 'next/link';
import { deleteMotorized } from './helpers/deleteMotorized';
import { unsubscribeMotorized } from './helpers/unsubscribeMotorized';

export const RowMotorized = ({ values }: { values: Motorized }) => {
  return (
    <>
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
          {values.status == 'ELIMINADO' ? (
            <p className='text-xs text-error font-bold'> ELIMINADO </p>
          ) : (
            <>
              <Link href={`motorizados/${values.id}/editar`}>
                <button className='btn btn-success btn-sm mr-3'>
                  <FaPen />
                </button>
              </Link>

              <Link
                href={`motorizados/${values.id}/cartilla`}
                as={`motorizados/${values.id}/cartilla`}
              >
                <a>
                  <button className='btn btn-info btn-sm mr-3'>
                    <ImProfile />
                  </button>
                </a>
              </Link>

              <button
                className='btn btn-warning btn-sm mr-3'
                onClick={() => {
                  unsubscribeMotorized(values.id);
                }}
              >
                <FaArrowRight />
              </button>

              <button
                className='btn btn-error btn-sm'
                onClick={() =>
                  deleteMotorized(
                    values.id,
                    `${values.profile.name} ${values.profile.lastName} `
                  )
                }
              >
                <FaUserAltSlash />
              </button>
            </>
          )}
        </td>
      </tr>
    </>
  );
};
