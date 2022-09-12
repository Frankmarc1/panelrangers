import { MainCategory } from '../../types/mainCategory';
import { FaPencilAlt } from "react-icons/fa";
import { useState } from 'react';



export const RowMaincategory = ({ values }: { values: MainCategory }) => {
    const [loading, setLoading] = useState(false);
    return (
        <tr>
            <td>
                <img
                    src={values.img}
                    width={60}
                    height={60}
                />

            </td>
            <td> {values.name} </td>
            <td>
                <button
                    className=' btn-sm mr-3 text-primary text-xl'

                >
                    <FaPencilAlt />
                </button>
                <input type="checkbox" className="toggle toggle-primary h-[1.2rem]" checked />
            </td>
        </tr>
    );
};
