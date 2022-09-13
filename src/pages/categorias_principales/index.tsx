import { db_client } from "../../firebase/client";
import { query, collection, orderBy } from "firebase/firestore";
import { FaPlus } from 'react-icons/fa';
import Link from 'next/link';

import { Dashboard } from "../../layout/Dashboard/Dashboard";
import { FirebaseDataTable } from "../../components/FirebaseDataTable/FirebaseDataTable";

import { RowMaincategory } from "../../app/mainCategory/RowMainCategory";
const MainCategorys = () => {
    return (
        <Dashboard>
            <Link href={`categorias_principales/add`}  >
            <a>
                <button className='btn btn-primary gap-2 btn-sm mb-2'>
                    <FaPlus />
                    Agregar Categoria
                </button>
            </a>
            </Link>
            
          
            <FirebaseDataTable
                headers={[
                    'Categoria',
                    'Imagen',
                    'Acciones'
                ]}
                RowComponent={RowMaincategory}
                qi={query(collection(db_client, 'main_categories'), orderBy('id'))}
            />
        </Dashboard>

    )
}
export default MainCategorys;