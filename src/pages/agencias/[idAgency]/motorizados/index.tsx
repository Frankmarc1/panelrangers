import { collection, doc, orderBy, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { RowMotorized } from '../../../../app/agencies/motorized/RowMotorized';
import { FirebaseDataTable } from '../../../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../../../firebase/client';
import { Dashboard } from '../../../../layout/Dashboard/Dashboard';

const Index = () => {
  const router = useRouter();
  const { idAgency } = router.query;

  const idAgencyValue = Array.isArray(idAgency) ? idAgency[0] : idAgency;

  const motorizedQuery = useMemo(() => {
    if (!router.isReady || !idAgencyValue) return null;

    const agencyRef = doc(db_client, 'empresas_agencia', idAgencyValue);

    return query(
      collection(db_client, 'users_motorizados'),
      where('reference_agencia', '==', agencyRef),
      orderBy('timeUp', 'desc')
    );
  }, [router.isReady, idAgencyValue]);

  if (!motorizedQuery || !idAgencyValue) {
    return (
      <Dashboard>
        <div>Cargando motorizados...</div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <FirebaseDataTable
        key={`agency-${idAgencyValue}-timeUp-desc`}
        RowComponent={RowMotorized}
        headers={[
          'D.N.I',
          'Nombre y Apellidos',
          'Ultimo reporte',
          'Estado',
          'Acciones',
        ]}
        qi={motorizedQuery}
      />
    </Dashboard>
  );
};

export default Index;