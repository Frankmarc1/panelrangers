import { User } from '../../types/user';
import { FaPen, FaUserAltSlash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { getDoc } from 'firebase/firestore';
import { Rol } from '../../types/rol';

export const RowUsers = ({ values }: { values: User }) => {
  const [nameRol, setNameRol] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoc(values.reference_rol)
      .then((snap) => {
        const { name } = snap.data() as Rol;
        setNameRol(name);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <tr>
      <td> {values.dni} </td>
      <td>{values.username}</td>
      <td>{!loading && nameRol}</td>

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
