import { collection, doc, orderBy, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import Link from 'next/link'
import { IoIosAddCircle } from "react-icons/io";

import { RowSeaccion } from '../../../../app/agencies/seaccion/RowSeaccion';
import { FirebaseDataTable } from '../../../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../../../firebase/client';
import { Dashboard } from '../../../../layout/Dashboard/Dashboard';

const Ranking = () => {
  const router = useRouter();
  const { idAgency } = router.query;

  return (
    <Dashboard>
      <div className='card bg-white border'>
        <div className='card-header  mx-[1rem] py-2'>
          <div className='flex justify-between'>
            <h3 className='card-title'>Lista de Temporadas</h3>
            <Link href={`/agencias/${idAgency}/temporadas/add`}>
              <button type="button" className="btn btn-primary btn-sm"><span className='text-xl mr-2'><IoIosAddCircle /></span>Agregar Temporadas</button>
            </Link>
          </div>
        </div>
        <div className='mx-[1rem]'>
          <FirebaseDataTable
            RowComponent={RowSeaccion}
            headers={['Banner', 'Nombre', 'Detalles', 'Fecha de Registro', 'Acciones']}
            qi={query(
              collection(
                db_client,
                `empresas_agencia/${idAgency}/temporadas_ranking`
              ), orderBy('nombre')
            )}
          />
        </div>
      </div>
    </Dashboard>
  );
};

export default Ranking;
