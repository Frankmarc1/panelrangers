import { collection, doc, orderBy, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { IoIosAddCircle } from "react-icons/io";

import { RowRanking } from '../../../../app/agencies/ranking/RowRanking';
import { FirebaseDataTable } from '../../../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../../../firebase/client';
import { Dashboard } from '../../../../layout/Dashboard/Dashboard';

const Ranking = () => {
  const router = useRouter();
  const { idAgency } = router.query;

  return (
    <Dashboard>
          <div className='flex justify-end mb-2 mr-[1rem]'>
         
            <Link href={`/agencias/${idAgency}/rankings/add`}>
              <button type="button" className="btn btn-primary btn-sm"><span className='text-xl mr-2'><IoIosAddCircle /></span>Agregar Rankings</button>

            </Link>
        </div>
        <div className='mx-[1rem]'>
          <FirebaseDataTable
            RowComponent={RowRanking}
            headers={['Imagen', 'Nombre', 'Porcentaje', 'Calificador', 'Puntos', 'Variacion', 'Acciones']}
            qi={query(
              collection(
                db_client,
                `empresas_agencia/${idAgency}/ranking`
              ), orderBy('nombre')
            )}
          />
        </div>
    </Dashboard>
  );
};

export default Ranking;
