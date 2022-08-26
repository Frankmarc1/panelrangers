import { collection, doc, orderBy, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';

import { RowMedal } from '../../../../app/agencies/medal/RowMedal';
import { FirebaseDataTable } from '../../../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../../../firebase/client';
import { Dashboard } from '../../../../layout/Dashboard/Dashboard';

const Medal = () => {
  const router = useRouter();
  const { idAgency } = router.query;

  return (
    <Dashboard>
      <FirebaseDataTable
        RowComponent={RowMedal}
        headers={['Imagen', 'Nombre', 'Descripcion', 'Acciones']}
        qi={query(
          collection(
            db_client,
            `empresas_agencia/${idAgency}/medallas`
          ),orderBy('nombre')
        )}
      />
    </Dashboard>
  );
};

export default Medal;
