import { collection, orderBy, query } from 'firebase/firestore';
import { useRouter } from 'next/router';

import { RowMedal } from '../../../../app/agencies/medal/RowMedal';
import { FirebaseDataTable } from '../../../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../../../firebase/client';
import { Dashboard } from '../../../../layout/Dashboard/Dashboard';

import Link from 'next/link';


const Medal = () => {
  const router = useRouter();
  const { idAgency } = router.query;

  return (
    <Dashboard>
      <div className='flex justify-end '>
        <Link href={`/agencias/${idAgency}/medallas/add`}>
          <button type="button" className="btn btn-primary btn-sm my-2 mr-2">Agregar Medallas</button>
        </Link>
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

    </Dashboard>
  );
};

export default Medal;
