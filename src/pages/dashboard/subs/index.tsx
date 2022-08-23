import { collection } from 'firebase/firestore';
import { RowSubs } from '../../../app/motorized/RowSubs';
import { FirebaseDataTable } from '../../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../../firebase/client';
import { Dashboard } from '../../../layout/Dashboard/Dashboard';

const colRef = collection(db_client, 'suscripciones');

const Subs = () => {
  return (
    <Dashboard>
      <FirebaseDataTable
        qi={colRef}
        headers={[
          'D.N.I',
          'TELEFONO',
          'NOMBRE Y APELLIDOS',
          'DATOS EN LA APP',
          'FECHA DE REGISTRO',
          'ACCIONES',
        ]}
        RowComponent={RowSubs}
      />
    </Dashboard>
  );
};

export default Subs;
