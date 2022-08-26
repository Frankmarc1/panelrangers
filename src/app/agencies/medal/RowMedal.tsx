import { Medal } from "../../../types/medal";

export const RowMedal = ({ values }: { values: Medal }) => {
    return (
        <tr>
            <td>
                <img src={values.imagen} alt='' width={64} height={64} />
            </td>
            <td>{values.nombre} </td>
            <td>{values.descripcion} </td>
            <td></td>
        </tr>
    );
};
