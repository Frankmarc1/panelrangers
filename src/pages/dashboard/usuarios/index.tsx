import { Dashboard } from '../../../layout/Dashboard/Dashboard';
import { collection } from 'firebase/firestore';
import { RowUsers } from '../../../app/users/RowUsers';
import { FirebaseDataTable } from '../../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../../firebase/client';
import { FaPlus } from 'react-icons/fa';
const colRef = collection(db_client, 'rangers_masters');

const Userss = () => {
  return (
    <Dashboard>
      <div className='w-full'>
        <button className='btn btn-success gap-2 btn-sm mb-2'>
          <FaPlus />
          Crear usuario
        </button>
      </div>
      <FirebaseDataTable
        headers={['D.N.I', 'NOMBRE Y APELLIDOS', 'ROL', 'ACCIONES']}
        RowComponent={RowUsers}
        qi={colRef}
      />
    </Dashboard>
  );
};
export default Userss;
