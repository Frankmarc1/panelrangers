import Link from "next/link";
import { useRouter } from "next/router";
import { FaPen } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

import { Medal } from "../../../types/medal";

export const RowMedal = ({ values }: { values: Medal }) => {
    const router = useRouter();
    const { idAgency } = router.query;
    return (
        <tr>
            <td>
                <img src={values.imagen} alt='' width={64} height={64} />
            </td>
            <td>
                {values.nombre}</td>
            <td><p className="w-[25rem] truncate">{values.descripcion} </p> </td>
            <td>
                <Link href={`/agencias/${idAgency}/medallas/${values.id}`}>
                    <button className='btn btn-success btn-sm mr-3'>
                        <FaPen />
                    </button>
                </Link>

                <Link href={`/agencias/`}>
                    <button className='btn btn-error btn-sm mr-3'>
                        <AiFillDelete />
                    </button>
                </Link>
            </td>


        </tr>
    );
};
