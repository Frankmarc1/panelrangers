
import { Business } from '../../types/business';
import { DateTime } from 'luxon';
import { FaPen, FaUserAltSlash } from 'react-icons/fa';
import { ImProfile } from "react-icons/im";
import { StatusHandler } from '../../common/statusHndler/StatusHandler';
import Link from 'next/link';


export const RowBusiness = ({ values }: { values: Business }) => {
    return (
        <>
            <tr>
                <td>
                    <img
                        alt='logo'
                        src={`${values.contentProfile.logo}`}
                        width={90}
                        height={90}
                    />
                </td>
                <td> {values.contentProfile.nameComercial} </td>
                <td>
                    <p className='w-[12rem] truncate '>
                        {values.contentProfile.descripcion}
                    </p>
                </td>
                <td>
                    <StatusHandler
                        collectionName='empresas'
                        data={values}
                     />
                </td>
                <td className=''>
                    <Link href={`empresas/${values.id}/tiendas`}>
                        <button className='btn btn-primary btn-sm mr-3' >
                            Tiendas
                        </button>
                    </Link>
                    <Link href={``}>
                        <button className='btn btn-error btn-sm mr-3' >
                            Eliminar
                        </button>
                    </Link>


                </td>
            </tr>

        </>
    );
};
