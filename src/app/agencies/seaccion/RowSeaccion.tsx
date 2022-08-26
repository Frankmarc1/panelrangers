import { DateTime } from 'luxon';
import { Seaccion } from "../../../types/seaccion";

export const RowSeaccion = ({ values }: { values: Seaccion }) => {
    return (
        <tr >
            <td className='h-[4.9rem] w-[5.9rem] '>
                <img src={values.banner} alt='' className="w-full h-full" />
            </td>
            <td>{values.nombre} </td>
            <td>
                <p className='w-[15rem] truncate '>{values.detalle}</p>
            </td>
            <td>
                {' '}
                {DateTime.fromSeconds(values.fecha_registro.seconds).toFormat(
                    'dd/MM/yyyy'
                )}{' '}
            </td>

            <td></td>
        </tr>
    );
};
