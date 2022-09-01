import { Sanction } from "../../../types/sanction";
import { DateTime } from "luxon";

export const RowSanctions = ({ values }: { values: Sanction}) => {
    return (
        <tr>
            <td>{values.titulo} </td>
            <td>
                <p className='w-[12rem] truncate '>{values.detalle}</p>
             </td>
            <td>{values.puntos}</td>
            <td>{values.tipo}</td>
            <td>
                {' '}
                {DateTime.fromMillis(values.fecha_inicio).toFormat(
                    'dd/MM/yyyy'
                )}{' '}
            </td>
            
            <td>
                {' '}
                {DateTime.fromMillis(values.fecha_fin).toFormat(
                    'dd/MM/yyyy'
                )}{' '}
            </td>
            <td>
                {values.estado ? 'Activo': 'Inactvo'}
            </td>
        </tr>
    );
};
