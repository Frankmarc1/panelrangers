
import { collection, doc, orderBy, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import {RowAgent} from '../../../../../app/agencies/agent/RowAgent';
import { FirebaseDataTable } from '../../../../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../../../../firebase/client';
import { Dashboard } from '../../../../../layout/Dashboard/Dashboard';

const Agentes = () => {
  const router = useRouter();
  const { idAgency } = router.query;
  return (
    <Dashboard>
      <FirebaseDataTable
        RowComponent={RowAgent}
        headers={[
          'Logo',
          'Nombre',
          'Dirreción',
          'Estado',
          'Acciones',
        ]}
        qi={query(
          collection(db_client, 'agencia_empresas'),
          where(
            'reference_agencia',        
            '==',
            doc(db_client, `empresas_agencia/${idAgency}`)
          ),
          orderBy("nombre")
        )}
      />
    </Dashboard>
  );
};

export default Agentes;
