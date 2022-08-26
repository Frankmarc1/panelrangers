import { Agent } from '../../../types/agent';

export const RowAgent = ({ values }: { values: Agent }) => {
  return (
    <tr>
      <td>
        <img src={values.logo} alt='' width={64} height={64} />
      </td>
      <td>{values.nombre} </td>
      <td>{values.direccion} </td>
      <td>{values.estado ? 'Activo' : 'Eliminado'}</td>
      <td></td>
    </tr>
  );
};
