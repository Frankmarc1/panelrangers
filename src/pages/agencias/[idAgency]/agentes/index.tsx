import { collection, doc, orderBy, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IoIosAddCircle } from "react-icons/io";

import { RowAgent } from '../../../../app/agencies/agent/RowAgent';
import { FirebaseDataTable } from '../../../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../../../firebase/client';
import { Dashboard } from '../../../../layout/Dashboard/Dashboard';

const Agents = () => {
  const router = useRouter();
  const { idAgency } = router.query;

  return (
    <Dashboard>

      <div className='flex justify-end mr-[1rem] mb-2'>
        <Link href={`/agencias/${idAgency}/agentes/add`}>
          <button type="button" className="btn btn-primary btn-sm"><span className='text-xl mr-2'><IoIosAddCircle /></span>Agregar Empresa</button>

        </Link>
      </div>
      <div className='mx-[1rem]'>
        <FirebaseDataTable
          RowComponent={RowAgent}
          headers={['Logo', 'Nombre', 'Dirreción', 'Estado', 'Acciones']}
          qi={query(
            collection(
              db_client,
              `empresas_agencia/${idAgency}/agencia_empresas`
            ),
            where(
              'reference_agencia',
              '==',
              doc(db_client, `empresas_agencia/${idAgency}`)
            ),
            orderBy('nombre', 'asc')
          )}
        />
      </div>

    </Dashboard>
  );
};

export default Agents;
