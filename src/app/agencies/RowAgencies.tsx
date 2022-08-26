import { DateTime } from 'luxon';
import Link from 'next/link';
import { FaBuilding, FaMotorcycle, FaMedal } from 'react-icons/fa';
import { GiPerson } from "react-icons/gi";
import { MdOutlineSpeakerNotes} from "react-icons/md";
import { IoMedal } from "react-icons/io5";

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
          <a className='btn btn-secondary btn-sm mr-2 '>
            <FaBuilding />
          </a>
        </Link>
        <Link href={`/agencias/${values.id}/medallas`}>
          <a className='btn btn-info btn-sm mr-2 text-white'>
            <FaMedal />
          </a>
        </Link>
        <Link href={`/agencias/${values.id}/rankings`}>
          <a className='btn btn-primary btn-sm mr-2 text-white'>
            <GiPerson />
          </a>
        </Link>
        <Link href={`/agencias/${values.id}/temporadas`}>
          <a className='btn btn-secondary btn-sm mr-2 text-white font-bold'>
            <IoMedal />
          </a>
        </Link>
        <Link href={`/agencias/${values.id}/sanciones`}>
          <a className='btn btn-success btn-sm text-white font-bold'>
            <MdOutlineSpeakerNotes />
          </a>
        </Link>
      </td>
    </tr>
  );
};
