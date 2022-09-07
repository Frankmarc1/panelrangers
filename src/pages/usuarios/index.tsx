import { Dashboard } from '../../layout/Dashboard/Dashboard';
import { collection } from 'firebase/firestore';
import { RowUsers } from '../../app/users/RowUsers';
import { FirebaseDataTable } from '../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../firebase/client';
import { FaPlus, FaPlusCircle } from 'react-icons/fa';
import Head from 'next/head';
import Link from 'next/link';
const colRef = collection(db_client, 'rangers_masters');

const Users = () => {
  return (
    <Dashboard>
      <Head>
        <title>Usuarios</title>
      </Head>
      <div>
        <div>
          <button className='btn btn-success gap-2 btn-sm mb-2 mr-2'>
            <FaPlusCircle />
            Crear usuario
          </button>
          <Link href={'/roles'}>
            <a className='text-md text-blue-700 font-bold'>Roles</a>
          </Link>
        </div>

        <FirebaseDataTable
          headers={['D.N.I', 'NOMBRE Y APELLIDOS', 'ROL', 'ACCIONES']}
          RowComponent={RowUsers}
          qi={colRef}
        />
      </div>
    </Dashboard>
  );
};
export default Users;
