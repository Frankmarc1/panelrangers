import { collection, query, orderBy } from "firebase/firestore";
import { useRouter } from "next/router";

import { db_client } from "../../../../../../firebase/client";
import { Dashboard } from "../../../../../../layout/Dashboard/Dashboard";
import { RowProducts } from "../../../../../../app/business/stores/RowProducts";
import { FirebaseDataTable } from "../../../../../../components/FirebaseDataTable/FirebaseDataTable";
const Products = () => {
    const router = useRouter();
    const { idBusiness } = router.query;
    const {idComercio}=router.query;
 
    return (
        <Dashboard>
            <FirebaseDataTable
            headers={[
                'Imagen',
                'Nombre',
                'Categorias',
                'Precio/Variedades',
                'Acciones'
            ]}
                RowComponent={RowProducts}
                qi={query(collection(db_client, `/empresas/${idBusiness}/comercios/${idComercio}/productos/`), orderBy('id'))}
            />


        </Dashboard>
    );
}
export default Products;