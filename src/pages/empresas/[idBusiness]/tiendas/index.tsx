import { collection, query, orderBy } from "firebase/firestore";
import {useRouter} from 'next/router';
import { Dashboard } from "../../../../layout/Dashboard/Dashboard";
import { db_client } from "../../../../firebase/client";
import { RowStores } from "../../../../app/business/stores/RowStores";
import { FirebaseDataTable } from "../../../../components/FirebaseDataTable/FirebaseDataTable";
const Business = () => {
    const router = useRouter();
    const { idBusiness } = router.query;
    return (
        <Dashboard>
            <FirebaseDataTable
                headers={[
                    'Imagen',
                    'Sector Economico',
                    'Nombre',
                    'Atencion',
                    'ACCIONES',
                ]}
                RowComponent={RowStores}
                qi={query(collection(db_client, `empresas/${idBusiness}/comercios`),orderBy('id'))}
            />
        </Dashboard>
    );
}
export default Business;