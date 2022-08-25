import { DateTime } from 'luxon';
import { Agent } from '../../../types/agent';
export const RowAgent = ({ values }: { values: Agent }) => {
    console.log(values);
  return (
    <tr>
      <td>{values.nombre} </td>
      <td>{values.direccion} </td>
   
      <td>Acc</td>
    </tr>
  );
};
