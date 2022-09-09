import { collection, doc, orderBy, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { RowSanctions } from '../../../../app/agencies/sanction/RowSanctions';
import { FirebaseDataTable } from '../../../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../../../firebase/client';
import { Dashboard } from '../../../../layout/Dashboard/Dashboard';
import Link from 'next/link';
import { IoIosAddCircle } from "react-icons/io";

const Sanctions = () => {
  const router = useRouter();
  const { idAgency } = router.query;

  return (
    <Dashboard>
      <div className='flex justify-end mb-2 mr-[1rem]'>
        <Link href={`/agencias/${idAgency}/sanciones/add`}>
          <button type="button" className="btn btn-primary btn-sm"><span className='text-xl mr-2'><IoIosAddCircle /></span>Agregar Recompensas o Sanciones</button>
        </Link>
      </div>

      <div className='mx-[1rem]'>
        <FirebaseDataTable
          RowComponent={RowSanctions}
          headers={['Titulo', 'Detalles', 'Puntos', 'Tipo', 'Fecha de Inicio', 'Fecha Final', 'Estado', 'Acciones']}
          qi={query(
            collection(
              db_client,
              `empresas_agencia/${idAgency}/recompensas_y_sanciones`
            ), orderBy('titulo')
          )}
        />
      </div>
    </Dashboard>
  );
};

export default Sanctions;
