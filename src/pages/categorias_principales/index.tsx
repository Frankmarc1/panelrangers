import { Dashboard } from "../../layout/Dashboard/Dashboard";
import { FirebaseDataTable } from "../../components/FirebaseDataTable/FirebaseDataTable";
import { db_client } from "../../firebase/client";
import { query,collection,orderBy } from "firebase/firestore";
import { RowMaincategory } from "../../app/mainCategory/RowMainCategory";
const MainCategorys=()=>{
    return(
        <Dashboard>
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