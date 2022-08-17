import { Dashboard } from '../../../layout/Dashboard/Dashboard';
import { collection } from 'firebase/firestore';
import { RowUsers } from '../../../app/users/RowUsers';
import { FirebaseDataTable } from '../../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../../firebase/client';
const colRef = collection(db_client, 'rangers_masters');
console.log(colRef)

const Userss = () => {
  return (
    <Dashboard>
      <FirebaseDataTable
        headers={[
          'D.N.I',
          'NOMBRE Y APELLIDOS',
          'ROL',
          'ACCIONES',
        ]}
        RowComponent={RowUsers}

        qi={colRef}

      />

    </Dashboard>

  );

};
export default Userss;
