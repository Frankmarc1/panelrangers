import { collection, doc, orderBy, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';

import { RowMedal } from '../../../../app/agencies/medal/RowMedal';
import { FirebaseDataTable } from '../../../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../../../firebase/client';
import { Dashboard } from '../../../../layout/Dashboard/Dashboard';
import MedalAdd from './add';
import Link from 'next/link';


const Medal = () => {
  const router = useRouter();
  const { idAgency } = router.query;

  return (
    <Dashboard>
      <div className='card bg-white boder'>
        <div className='card-header border-slate-500'>
          <div className='flex justify-end '>
            <Link href={`/agencias/${idAgency}/medallas/add`}>
              <button type="button" className="btn btn-primary btn-sm my-2 mr-2">Agregar Medallas</button>
            </Link>
          </div>
        </div>
        <div>
        <FirebaseDataTable
          RowComponent={RowMedal}
          headers={['Imagen', 'Nombre', 'Descripcion', 'Acciones']}
          qi={query(
            collection(
              db_client,
              `empresas_agencia/${idAgency}/medallas`
            ), orderBy('nombre')
          )}
        />
        </div>
      </div>
    </Dashboard>
  );
};

export default Medal;
