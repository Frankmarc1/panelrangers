import { collection, orderBy, query } from 'firebase/firestore';

import { RowAgencies } from '../../app/agencies/RowAgencies';
import { FirebaseDataTable } from '../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../firebase/client';
import { Dashboard } from '../../layout/Dashboard/Dashboard';

const Agencies = () => {
  return (
    <Dashboard>
      <FirebaseDataTable
        headers={[
          'NOMBRE',
          'DEPARTAMENTO',
          'DIRECCION',
          'ESTADO',
          'FECHA DE REGISTRO',
          'ACCIONES',
        ]}
        RowComponent={RowAgencies}
        qi={query(collection(db_client, 'empresas_agencia'), orderBy('id'))}
      />
    </Dashboard>
  );
};
export default Agencies;
