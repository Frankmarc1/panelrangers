import { collection, orderBy, query } from 'firebase/firestore';
import Head from 'next/head';
import Link from 'next/link';
import { IoIosAddCircle } from 'react-icons/io';

import { RowAgencies } from '../../app/agencies/RowAgencies';
import { FirebaseDataTable } from '../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../firebase/client';
import { Dashboard } from '../../layout/Dashboard/Dashboard';

const Agencies = () => {
  return (
    <Dashboard>
      <Head>
        <title> Agencias </title>
      </Head>
      <div className='mx-[.4rem]'>
        <div className='mb-2 flex justify-end'>
          <Link href={`#`}>
            <button type='button' className='btn btn-primary btn-sm'>
              <span className='text-xl mr-2'>
                <IoIosAddCircle />
              </span>
              Agregar Agencias
            </button>
          </Link>
        </div>

        <FirebaseDataTable
          headers={[
            'NOMBRE',
            'DEPARTAMENTO',
            'DIRECCION',
            'ESTADO',
            'FECHA DE REGISTRO',
            'ACCIONES',
          ]}
          RowComponent={RowAgencies}
          qi={query(collection(db_client, 'empresas_agencia'), orderBy('id'))}
        />
      </div>
    </Dashboard>
  );
};
export default Agencies;
