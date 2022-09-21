import { MainCategory } from '../../types/mainCategory';
import { FaPencilAlt } from "react-icons/fa";
import { useState } from 'react';
import Link from 'next/link';
import { StatusHandler } from '../../common/statusHndler/StatusHandler';
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
            <td >
                <div className='flex'>
                    <Link href={`categorias_principales/${values.id}`}>
                        <button
                            className=' btn-sm mr-3 text-primary text-xl'

                        >
                            <FaPencilAlt />
                        </button>
                    </Link>
                    <div className='mt-[0.5rem]'>
                        <StatusHandler
                            collectionName='main_categories'
                            data={values}

                        />
                    </div>
                </div>

            </td>
        </tr>
    );
};
