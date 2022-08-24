import { collection, doc, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { RowMotorized } from '../../../../../app/agencies/motorized/RowMotorized';
import { FirebaseDataTable } from '../../../../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../../../../firebase/client';
import { Dashboard } from '../../../../../layout/Dashboard/Dashboard';

const Index = () => {
  const router = useRouter();
  const { idAgency } = router.query;

  return (
    <Dashboard>
      <FirebaseDataTable
        RowComponent={RowMotorized}
        headers={['D.N.I', 'Nombre y Apellidos', 'Ultimo reporte', 'Estado']}
        qi={query(
          collection(db_client, 'users_motorizados'),
          where(
            'reference_agencia',
            '==',
            doc(db_client, `empresas_agencia/${idAgency}`)
          )
        )}
      />
    </Dashboard>
  );
};

export default Index;
