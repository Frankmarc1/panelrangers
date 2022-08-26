import { FaListUl } from 'react-icons/fa';
import { Report } from '../../../types/report';
import { currencyFormat, formatPercent } from '../../../utils/strFormat';

export const RowReports = ({ values }: { values: Report }) => {
  return (
    <tr>
      <td> {values.cantidad_pedidos} </td>
      <td> {values.nombreReporte} </td>
      <td> {values.observacion} </td>
      <td> {currencyFormat(values.deuda)} </td>
      <td> {currencyFormat(values.deuda)} </td>
      <td> {currencyFormat(values.deuda)} </td>
      <td> {formatPercent(values.porcentaje)} </td>
      <td> {values.estado} </td>
      <td>
        {values.registro_horas && (
          <div className='badge badge-primary mr-2'>
            {values.registro_horas
              .filter((register) => register.tipo === 'Comisión')
              .map((register) => register.horas)
              .reduce((a, b) => a + b, 0)}{' '}
            C
          </div>
        )}

        {values.registro_horas && (
          <div className='badge badge-secondary'>
            {values.registro_horas
              .filter((register) => register.tipo === 'Part time')
              .map((register) => register.horas)
              .reduce((a, b) => a + b, 0)}{' '}
            P.T
          </div>
        )}
      </td>
      <td>
        <button className='btn btn-primary btn-sm'>
          <FaListUl />
        </button>
      </td>
    </tr>
  );
};
