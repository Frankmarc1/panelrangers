import { collection, doc, orderBy, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';

import { RowRanking } from '../../../../app/agencies/ranking/RowRanking';
import { FirebaseDataTable } from '../../../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../../../firebase/client';
import { Dashboard } from '../../../../layout/Dashboard/Dashboard';

const Ranking = () => {
  const router = useRouter();
  const { idAgency } = router.query;

  return (
    <Dashboard>
      <FirebaseDataTable
        RowComponent={RowRanking}
        headers={['Imagen', 'Nombre', 'Porcentaje','Calificador', 'Puntos','Variacion','Acciones']}
        qi={query(
          collection(
            db_client,
            `empresas_agencia/${idAgency}/ranking`
          ),orderBy('nombre')
        )}
      />
    </Dashboard>
  );
};

export default Ranking;
