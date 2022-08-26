import { collection, doc, orderBy, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';

import { RowSeaccion } from '../../../../app/agencies/seaccion/RowSeaccion';
import { FirebaseDataTable } from '../../../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../../../firebase/client';
import { Dashboard } from '../../../../layout/Dashboard/Dashboard';

const Ranking = () => {
  const router = useRouter();
  const { idAgency } = router.query;

  return (
    <Dashboard>
      <FirebaseDataTable
        RowComponent={RowSeaccion}
        headers={['Banner', 'Nombre', 'Detalles','Fecha de Registro','Acciones']}
        qi={query(
          collection(
            db_client,
            `empresas_agencia/${idAgency}/temporadas_ranking`
          ),orderBy('nombre')
        )}
      />
    </Dashboard>
  );
};

export default Ranking;
