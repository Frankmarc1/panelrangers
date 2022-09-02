import { Motorized } from '../../types/motorized';
import { DateTime } from 'luxon';
import { FaPen, FaUserAltSlash } from 'react-icons/fa';
import { ImProfile } from "react-icons/im";
import Link from 'next/link';


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
          <Link href={`motorizados/${values.id}/editar`}>
            <button className='btn btn-success btn-sm mr-3' >
              <FaPen />
            </button>
          </Link>

          <button className='btn btn-error btn-sm mr-3'>
            <FaUserAltSlash />
          </button>

          <Link
            href={`motorizados/${values.id}/cartilla`}
            as={`motorizados/${values.id}/cartilla`}
          >
            <a>
              <button className='btn btn-info btn-sm'>
                <ImProfile />
              </button>
            </a>
          </Link>

        </td>
      </tr>
         
    </>
  );
};
