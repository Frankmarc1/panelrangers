import { collection, orderBy, query } from "firebase/firestore";
import { useRouter } from "next/router";

import { db_client } from "../../../firebase/client";
import { Dashboard } from "../../../layout/Dashboard/Dashboard";
import { FirebaseDataTable } from "../../../components/FirebaseDataTable/FirebaseDataTable";
import { RowProducts } from "./RowProducts";

const Products = () => {
  const router = useRouter();
  const { idBusiness, idComercio } = router.query;

  const idBusinessValue = Array.isArray(idBusiness)
    ? idBusiness[0]
    : idBusiness;

  const idComercioValue = Array.isArray(idComercio)
    ? idComercio[0]
    : idComercio;

  if (!idBusinessValue || !idComercioValue) {
    return (
      <Dashboard>
        <div className="p-6">
          <div className="rounded-2xl bg-white p-5 text-sm font-bold text-slate-600 shadow">
            Cargando comercio...
          </div>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <section className="min-h-screen bg-slate-100 px-4 py-6 md:px-8">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Productos del comercio
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Valida, revisa o anula productos antes de mostrarlos en VeryGo.
            </p>
          </div>
        </header>

        <div className="w-full overflow-x-auto rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-xl">
          <div className="min-w-[1180px]">
            <FirebaseDataTable
              headers={[
                "Producto",
                "Categoría",
                "Precios",
                "Estado",
                "Validación",
                "Acciones",
              ]}
              RowComponent={RowProducts}
              qi={query(
  collection(
    db_client,
    `/empresas/${idBusinessValue}/comercios/${idComercioValue}/productos`
  ),
  orderBy("verificationSort", "asc"),
  orderBy("id", "asc")
)}
            />
          </div>
        </div>
      </section>
    </Dashboard>
  );
};

export default Products;