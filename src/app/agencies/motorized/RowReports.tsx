import { useRouter } from 'next/router';
import { FaListUl } from 'react-icons/fa';
import { InlineInput } from '../../../components/Inputs/InlineInput';
import { Params } from '../../../types/params';
import { Report } from '../../../types/report';
import { currencyFormat, formatPercent } from '../../../utils/strFormat';
import { saveObs } from './helpers/saveObs';
import { savePercent } from './helpers/savePercent';

export const RowReports = ({ values }: { values: Report }) => {
  const { idMotorized } = useRouter().query as Params;

  return (
    <tr>
      <td> {values.cantidad_pedidos} </td>
      <td> {values.nombreReporte} </td>
      <td >
        {
          values.observacion
            ? <div className='pr-5'>
              <InlineInput
                value={values.observacion}
                onSave={async (value) =>
                  await saveObs(value, idMotorized, values.idReporte)
                }
              />
            </div>
            : null
        }
      </td>
      <td> {currencyFormat(values.deuda)} </td>
      <td> {currencyFormat(values.deuda)} </td>
      <td> {currencyFormat(values.deuda)} </td>
      <td className='mr-0 pr-0'>
        <InlineInput
          value={formatPercent(values.porcentaje)}
          onSave={async (value) =>
            await savePercent(parseFloat(value), idMotorized, values.idReporte)
          }
        />
      </td>
      <td >
        <p className='ml-5'> {values.estado}</p> </td>
      <td>
        {values.registro_horas && (
          <div className='badge badge-primary'>
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
