import { Agencie } from '../../types/agencies';
import { DateTime} from 'luxon';

export const RowAgencies= ({ values }: { values: Agencie }) => {
  return (
    <tr>
      <td> {values.nombre} </td>
      <td> {values.departamento} </td>
      <td>{values.direccion}</td>
      <td> {values.estado ? 'Activo' : 'Inactivo'} </td>
      <td> {' '}
        {DateTime.fromSeconds(values.fecha_registro.seconds).toFormat(
          'dd/MM/yyyy'
        )}{' '}
      </td>
     
    </tr>
  );
};
