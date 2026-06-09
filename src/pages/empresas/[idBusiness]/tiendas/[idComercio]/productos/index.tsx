import { useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import { db_client } from "../../../../../../firebase/client";
import { Dashboard } from "../../../../../../layout/Dashboard/Dashboard";
import { RowProducts } from "../../../../../../app/business/stores/RowProducts";
import { FirebaseDataTable } from "../../../../../../components/FirebaseDataTable/FirebaseDataTable";

const Products = () => {
  const router = useRouter();
  const { idBusiness, idComercio } = router.query;

  const [validatingAll, setValidatingAll] = useState(false);

  const idBusinessValue = Array.isArray(idBusiness) ? idBusiness[0] : idBusiness;
  const idComercioValue = Array.isArray(idComercio)
    ? idComercio[0]
    : idComercio;

  const productsCollection =
    idBusinessValue && idComercioValue
      ? collection(
          db_client,
          "empresas",
          idBusinessValue,
          "comercios",
          idComercioValue,
          "productos"
        )
      : null;

  const handleValidateAllPending = async () => {
    if (!idBusinessValue || !idComercioValue || !productsCollection) {
      toast.error("No se pudo obtener la ruta de productos.");
      return;
    }

    const confirm = window.confirm(
      "¿Deseas validar todos los productos pendientes de este comercio?"
    );

    if (!confirm) return;

    try {
      setValidatingAll(true);

      const snap = await getDocs(productsCollection);

      const pendingDocs = snap.docs.filter((document) => {
        const data = document.data();

        return (
          data.verified !== true ||
          data.validationStatus !== "APPROVED" ||
          data.verificationSort !== 1
        );
      });

      if (pendingDocs.length === 0) {
        toast.success("No hay productos pendientes por validar.");
        return;
      }

      let batch = writeBatch(db_client);
      let operationCount = 0;
      let validatedCount = 0;

      for (const document of pendingDocs) {
        batch.update(document.ref, {
          verified: true,

          // Lo dejo porque ya lo estabas usando, posiblemente por compatibilidad
          // con algún código anterior que tenía el typo.
          verfied: true,

          validationStatus: "APPROVED",
          verificationSort: 1,

          validatedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          validationSource: "RANGERS_DASHBOARD",
        });

        operationCount++;
        validatedCount++;

        if (operationCount >= 450) {
          await batch.commit();
          batch = writeBatch(db_client);
          operationCount = 0;
        }
      }

      if (operationCount > 0) {
        await batch.commit();
      }

      toast.success(`${validatedCount} producto(s) validado(s).`);

      router.replace(router.asPath);
    } catch (error) {
      console.error("VALIDATE_ALL_PRODUCTS_ERROR:", error);
      toast.error("No se pudieron validar todos los productos.");
    } finally {
      setValidatingAll(false);
    }
  };

  if (!idBusinessValue || !idComercioValue || !productsCollection) {
    return (
      <Dashboard>
        <div className="rounded-xl bg-white p-4 text-sm font-semibold text-slate-700">
          Cargando comercio...
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Productos del comercio
          </h1>

          <p className="text-sm text-slate-500">
            Valida los productos registrados por la tienda antes de mostrarlos
            en VeryGo.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleValidateAllPending}
          disabled={validatingAll}
        >
          {validatingAll ? "Validando..." : "Validar todos pendientes"}
        </button>
      </div>

      <FirebaseDataTable
        headers={[
          "Imagen",
          "Nombre",
          "Categoría",
          "Precio/Variedades",
          "Estado",
          "Verificación",
          "Acciones",
        ]}
        RowComponent={RowProducts}
        qi={query(
          productsCollection,
          orderBy("verificationSort", "asc"),
          orderBy("timeUp", "desc")
        )}
      />
    </Dashboard>
  );
};

export default Products;