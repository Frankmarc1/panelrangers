import { db_client } from "../../firebase/client";
import { collection, orderBy, query } from "firebase/firestore";

import { Dashboard } from "../../layout/Dashboard/Dashboard";
import { FirebaseDataTable } from "../../components/FirebaseDataTable/FirebaseDataTable";
import { RowPromotionAdmin } from "../../app/promotions/RowPromotionAdmin";

const PromotionsAdminPage = () => {
  return (
    <Dashboard>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-800">
          Promociones VeryGo
        </h1>

        <p className="text-sm text-slate-500">
          Revisa, aprueba, pausa o rechaza las promociones propuestas por los
          restaurantes.
        </p>
      </div>

      <FirebaseDataTable
        headers={[
          "Imagen",
          "Producto",
          "Tienda",
          "Precio",
          "Estado",
          "Prioridad",
          "Acciones",
        ]}
        RowComponent={RowPromotionAdmin}
        qi={query(collection(db_client, "promociones"), orderBy("id"))}
      />
    </Dashboard>
  );
};

export default PromotionsAdminPage;