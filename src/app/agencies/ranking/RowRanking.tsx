import { Ranking } from "../../../types/ranking";

export const RowRanking = ({ values }: { values: Ranking }) => {
    return (
        <tr>
            <td>
                <img src={values.imagen} alt='' width={64} height={64} />
            </td>
            <td>{values.nombre} </td>
            <td>{values.beneficio_porcentaje} </td>
            <td>{values.calificador} </td>
            <td>{values.puntos} </td>
            <td>{values.variacion} </td>
            <td></td>
        </tr>
    );
};
