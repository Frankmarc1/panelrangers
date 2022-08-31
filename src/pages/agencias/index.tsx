import { collection, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';
import { IoIosAddCircle } from "react-icons/io";

import { RowAgencies } from '../../app/agencies/RowAgencies';
import { FirebaseDataTable } from '../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../firebase/client';
import { Dashboard } from '../../layout/Dashboard/Dashboard';

const Agencies = () => {
  return (
    <Dashboard>
      <div className='card  bg-white boder'>
      <div className='card-header  mx-[1rem] py-2'>
          <div className='flex justify-between'>
            <h3 className="card-title">Lista de Agentes</h3>
            <Link href={`#`}>
              <button type="button" className="btn btn-primary btn-sm"><span className='text-xl mr-2'><IoIosAddCircle /></span>Agregar Agencias</button>

            </Link>
          </div>
        </div>
        <div className='mx-[1rem] mb-2'>
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
        </div>
      </div>
    </Dashboard>
  );
};
export default Agencies;
