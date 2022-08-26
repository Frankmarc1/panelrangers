import { collection } from 'firebase/firestore';
import { RowMotorized } from '../../app/motorized/RowMotorized';
import { FirebaseDataTable } from '../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../firebase/client';
import { Dashboard } from '../../layout/Dashboard/Dashboard';

const colRef = collection(db_client, 'users_motorizados');

const Motorized = () => {
  return (
    <Dashboard>
      <div className={`h-[35.2rem] relative`}>
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
          qi={colRef}
        />
      </div>
    </Dashboard>
  );
};

export default Motorized;
