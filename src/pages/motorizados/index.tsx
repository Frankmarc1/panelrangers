import { collection, orderBy, query } from 'firebase/firestore';

import { RowMotorized } from '../../app/motorized/RowMotorized';
import { FirebaseDataTable } from '../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../firebase/client';
import { Dashboard } from '../../layout/Dashboard/Dashboard';

const Motorized = () => {
  return (
    <Dashboard>

        <FirebaseDataTable
        
          headers={[
            'D.N.I',
            'TELEFONO',
            'NOMBRE Y APELLIDOS',
            'DATOS EN LA APP',
            'FECHA DE REGISTRO',
            'ACCIONES',
          ]}
          RowComponent={RowMotorized}
          qi={query(collection(db_client, 'users_motorizados'), orderBy('id'))}
        />
      
    </Dashboard>
  );
};

export default Motorized;
