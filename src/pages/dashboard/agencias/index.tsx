import { collection } from 'firebase/firestore';
import { RowAgencies } from '../../../app/agencies/RowAgencies';
import { FirebaseDataTable } from '../../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../../firebase/client';
import { Dashboard } from '../../../layout/Dashboard/Dashboard';

const colRef = collection(db_client, 'empresas_agencia');

const Agencies = () => {
  return (
    <Dashboard>
      <div className='h-[35.2rem] relative'>
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
        qi={colRef}
      />
      </div>
    </Dashboard>
  );
};
export default Agencies;