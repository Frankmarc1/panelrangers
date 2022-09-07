import Head from 'next/head';
import { FaPlusCircle } from 'react-icons/fa';
import { collection } from 'firebase/firestore';

import { RowRol } from '../../app/roles/RowRol';
import { FirebaseDataTable } from '../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../firebase/client';
import { Dashboard } from '../../layout/Dashboard/Dashboard';
import Link from 'next/link';
import { FormRol } from '../../app/roles/FormRol';

const Roles = () => {
  return (
    <Dashboard>
      <Head>
        <title>Roles</title>
      </Head>
      <div className='mb-3'>
        <label
          htmlFor='my-modal'
          className='btn modal-button btn-sm btn-success btn-sm mr-2 gap-2'
        >
          <FaPlusCircle />
          Crear rol
        </label>

        <Link href={'/usuarios'}>
          <a className='text-md text-blue-700 font-bold'>Usuarios</a>
        </Link>
      </div>

      <FirebaseDataTable
        qi={collection(db_client, 'roles')}
        headers={['Nombre', 'Total de usuarios', 'Acciones']}
        RowComponent={RowRol}
      />

      <FormRol />
    </Dashboard>
  );
};

export default Roles;
