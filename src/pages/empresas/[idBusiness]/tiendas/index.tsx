import { collection, query, orderBy } from "firebase/firestore";
import { useRouter } from 'next/router';
import { useState } from "react";
import { ChangeEvent } from "react";
import { Dashboard } from "../../../../layout/Dashboard/Dashboard";
import { db_client } from "../../../../firebase/client";
import { RowStores } from "../../../../app/business/stores/RowStores";
import { FirebaseDataTable } from "../../../../components/FirebaseDataTable/FirebaseDataTable";
import { Commerce } from "../../../../types/comerce";
import { CloneStore } from "../../../../app/business/stores/CloneStore";
const Business = () => {
    const [commerce, setCommerce] = useState<Commerce[]>([]);
    const [selectedStores, setSelectedStores] = useState<string[]>([]);

    const router = useRouter();
    const { idBusiness } = router.query;

    const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked;
    
        if (value) {
          if (commerce.length) {
            setSelectedStores(commerce.map((com) => com.id));
          }
        } else {
          setSelectedStores([]);
        }
      };
      
    return (
        <Dashboard>
           
         
            <div className={`flex t-0 `}>
             
                <button className='btn btn-primary btn-sm mr-3 mt-1 mb-2' >
                    Verficar Seleccionados
                </button>
                <div className="form-control flex justify-end">
                    <label className="cursor-pointer label">
                        <input
                            type="checkbox"
                            className="checkbox checkbox-secondary mr-3"
                            onChange={handleSelectAll}
                        />
                        <span className="label-text">Seleccionar Todos</span>
                    </label>
                </div>
            </div>
          
            <FirebaseDataTable
                headers={[
                    ` `,
                    'Imagen',
                    'Sector Economico',
                    'Nombre',
                    'Verificación',
                    'Atención',
                    'ACCIONES',
                ]}
                RowComponent={RowStores}
                qi={query(collection(db_client, `empresas/${idBusiness}/comercios`), orderBy('id'))}
            />
            
        </Dashboard>
    );
}
export default Business;