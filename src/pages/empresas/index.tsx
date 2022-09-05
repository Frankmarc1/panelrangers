import { collection, query, orderBy } from "firebase/firestore";
import { Dashboard } from "../../layout/Dashboard/Dashboard";
import { RowBusiness } from "../../app/business/RowBusiness";
import { FirebaseDataTable } from "../../components/FirebaseDataTable/FirebaseDataTable";
import { db_client } from "../../firebase/client";
const Business = () => {
    return (
        <Dashboard>
                <FirebaseDataTable
                    headers={[
                        'Imagen',
                        'Nombre',
                        'Descripcion',
                        'ACCIONES',
                    ]}
                    RowComponent={RowBusiness}
                    qi={query(collection(db_client, 'empresas'), orderBy('id'))}
                />
        </Dashboard>
    );
}
export default Business;