import { collection, doc, orderBy, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { RowSanctions } from '../../../../app/agencies/sanction/RowSanctions';
import { FirebaseDataTable } from '../../../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../../../firebase/client';
import { Dashboard } from '../../../../layout/Dashboard/Dashboard';

const Sanctions = () => {
  const router = useRouter();
  const { idAgency } = router.query;

  return (
    <Dashboard>
      <FirebaseDataTable
        RowComponent={RowSanctions}
        headers={['Titulo', 'Detalles', 'Puntos', 'Tipo','Fecha de Inicio','Fecha Final','Estado','Acciones']}
        qi={query(
          collection(
            db_client,
            `empresas_agencia/${idAgency}/recompensas_y_sanciones`
          ),orderBy('titulo')
        )}
      />
    </Dashboard>
  );
};

export default Sanctions;
