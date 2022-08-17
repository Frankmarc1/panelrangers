import { Users } from '../../types/users';
import { FaPen, FaUserAltSlash } from 'react-icons/fa';

export const RowUsers = ({ values }: { values: Users }) => {
    
    return (
        <tr>
            <td> {values.dni} </td>
            <td>
                {values.username}
            </td>
            <td>
                {

                }
            </td>

            <td className=''>
                <button className='btn btn-success btn-sm mr-3'>
                    <FaPen />
                </button>

                <button className='btn btn-error btn-sm'>
                    <FaUserAltSlash />
                </button>
            </td>
        </tr>
    );
};


