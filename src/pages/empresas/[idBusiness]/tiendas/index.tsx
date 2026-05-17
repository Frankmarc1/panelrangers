import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  DocumentData,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  UpdateData,
  writeBatch,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import { Dashboard } from '../../../../layout/Dashboard/Dashboard';
import { db_client } from '../../../../firebase/client';
import { RowStores } from '../../../../app/business/stores/RowStores';
import { FirebaseDataTable } from '../../../../components/FirebaseDataTable/FirebaseDataTable';
import { Commerce } from '../../../../types/comerce';

type MigrationStats = {
  storesChecked: number;
  productsChecked: number;
  productsUpdated: number;
  productsPending: number;
};

type CommerceOption = Commerce & {
  id: string;
  nombre?: string;
  name?: string;
  nickname?: string;
  name_comercio?: string;
};

function getString(value: unknown): string {
  return String(value || '').trim();
}

function getCommerceName(commerce: CommerceOption): string {
  return (
    getString(commerce.nombre) ||
    getString(commerce.name) ||
    getString(commerce.nickname) ||
    getString(commerce.name_comercio) ||
    commerce.id
  );
}

function normalizeAvailability(product: any): string {
  const availability = getString(product.availability).toUpperCase();

  if (
    availability === 'DISPONIBLE' ||
    availability === 'AGOTADO' ||
    availability === 'INACTIVO'
  ) {
    return availability;
  }

  if (product.status === true) return 'DISPONIBLE';

  return 'INACTIVO';
}

function normalizeTypes(types: any[]): any[] {
  if (!Array.isArray(types) || types.length === 0) {
    return [
      {
        id: Date.now().toString(),
        name: '',
        price: 0,
        status: true,
        adicionales: [],
      },
    ];
  }

  return types.map((type, index) => ({
    ...type,
    id: getString(type.id) || `${Date.now()}_${index}`,
    name: getString(type.name),
    price: Number(type.price || 0),
    status: type.status !== false,
    adicionales: Array.isArray(type.adicionales) ? type.adicionales : [],
  }));
}

const Business = (): JSX.Element => {
  const router = useRouter();
  const { idBusiness } = router.query;

  const [commerce, setCommerce] = useState<CommerceOption[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [loadingCommerce, setLoadingCommerce] = useState(false);
  const [migrating, setMigrating] = useState(false);

  const idBusinessValue = typeof idBusiness === 'string' ? idBusiness : '';

  const selectedStore = useMemo(() => {
    return commerce.find((item) => item.id === selectedStoreId) || null;
  }, [commerce, selectedStoreId]);

  useEffect(() => {
    if (!idBusinessValue) return;

    let active = true;

    const loadCommerce = async () => {
      try {
        setLoadingCommerce(true);

        const commerceSnap = await getDocs(
          query(
            collection(db_client, `empresas/${idBusinessValue}/comercios`),
            orderBy('id')
          )
        );

        if (!active) return;

        const commerceData = commerceSnap.docs.map((document) => {
          const data = document.data() as CommerceOption;

          return {
            ...data,
            id: data.id || document.id,
          };
        });

        setCommerce(commerceData);
      } catch (error) {
        console.error('LOAD_COMMERCE_ERROR:', error);
        toast.error('No se pudieron cargar los comercios.');
      } finally {
        if (active) {
          setLoadingCommerce(false);
        }
      }
    };

    loadCommerce();

    return () => {
      active = false;
    };
  }, [idBusinessValue]);

  const migrateSelectedStoreProductsToPendingReview = async () => {
    if (!idBusinessValue) {
      toast.error('No se pudo obtener la empresa.');
      return;
    }

    if (!selectedStoreId) {
      toast.error('Selecciona un comercio antes de adaptar productos.');
      return;
    }

    const storeName = selectedStore
      ? getCommerceName(selectedStore)
      : selectedStoreId;

    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Adaptar productos de este comercio?',
      html: `
        <div style="text-align:left">
          <p>Se adaptarán únicamente los productos del comercio:</p>
          <p><b>${storeName}</b></p>
          <br/>
          <p><b>Reglas:</b></p>
          <ul>
            <li>Todos sus productos quedarán como <b>pendientes de revisión</b>.</li>
            <li>Ningún producto antiguo quedará aprobado automáticamente.</li>
            <li>Rangers deberá revisar y aprobar cada producto desde el panel.</li>
            <li>Se agregará <b>verificationSort: 0</b> para ordenarlos arriba.</li>
            <li>El índice de VeryGo se actualizará mediante tus triggers.</li>
          </ul>
          <br/>
          <p style="color:#b45309"><b>Recomendación:</b> usa este botón solo para el comercio que vas a revisar.</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Adaptar productos',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#4f46e5',
    });

    if (!result.isConfirmed) return;

    try {
      setMigrating(true);

      const stats: MigrationStats = {
        storesChecked: 1,
        productsChecked: 0,
        productsUpdated: 0,
        productsPending: 0,
      };

      const productsRef = collection(
        db_client,
        `empresas/${idBusinessValue}/comercios/${selectedStoreId}/productos`
      );

      const productsSnap = await getDocs(productsRef);

      let batch = writeBatch(db_client);
      let batchOperations = 0;

      const commitBatchIfNeeded = async (force = false) => {
        if (batchOperations === 0) return;

        if (force || batchOperations >= 450) {
          await batch.commit();
          batch = writeBatch(db_client);
          batchOperations = 0;
        }
      };

      for (const productDoc of productsSnap.docs) {
        stats.productsChecked++;

        const product = productDoc.data() as any;

        const availability = normalizeAvailability(product);
        const normalizedTypes = normalizeTypes(product.tipos || []);

        const updatePayload: UpdateData<DocumentData> = {
          id: getString(product.id) || productDoc.id,

          availability,
          status: product.status === true,

          verified: false,
          verfied: false,
          validationStatus: 'PENDING',
          verificationSort: 0,
          validationSource: 'RANGERS_MIGRATION_FORCE_PENDING',
          rejectedReason: null,

          tipos: normalizedTypes,

          updatedAt: serverTimestamp(),
          migratedAt: serverTimestamp(),
        };

        if (!product.createdAt) {
          updatePayload.createdAt = product.timeUp || serverTimestamp();
        }

        if (!product.categoria && product.categoryId) {
          updatePayload.categoria = product.categoryId;
        }

        batch.update(productDoc.ref, updatePayload);

        batchOperations++;
        stats.productsUpdated++;
        stats.productsPending++;

        await commitBatchIfNeeded();
      }

      await commitBatchIfNeeded(true);

      await Swal.fire({
        icon: 'success',
        title: 'Productos adaptados',
        html: `
          <div style="text-align:left">
            <p><b>Comercio:</b> ${storeName}</p>
            <p><b>Productos revisados:</b> ${stats.productsChecked}</p>
            <p><b>Productos actualizados:</b> ${stats.productsUpdated}</p>
            <p><b>Pendientes de revisión:</b> ${stats.productsPending}</p>
          </div>
        `,
        confirmButtonText: 'Entendido',
      });
    } catch (error) {
      console.error('MIGRATE_SELECTED_STORE_PRODUCTS_ERROR:', error);
      toast.error('No se pudieron adaptar los productos del comercio.');
    } finally {
      setMigrating(false);
    }
  };

  if (!idBusinessValue) {
    return (
      <Dashboard>
        <div className="p-6">
          <div className="rounded-2xl bg-white p-5 text-sm font-bold text-slate-600 shadow">
            Cargando empresa...
          </div>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="select select-bordered select-sm min-w-[260px]"
            value={selectedStoreId}
            onChange={(event) => setSelectedStoreId(event.target.value)}
            disabled={loadingCommerce || migrating}
          >
            <option value="">
              {loadingCommerce
                ? 'Cargando comercios...'
                : 'Selecciona un comercio'}
            </option>

            {commerce.map((item) => (
              <option key={item.id} value={item.id}>
                {getCommerceName(item)}
              </option>
            ))}
          </select>

          <button
            className="btn btn-warning btn-sm"
            type="button"
            onClick={migrateSelectedStoreProductsToPendingReview}
            disabled={migrating || !selectedStoreId}
          >
            {migrating
              ? 'Adaptando productos...'
              : 'Adaptar productos del comercio'}
          </button>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">
          Botón temporal: deja productos antiguos como pendientes de revisión.
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
        qi={query(
          collection(db_client, `empresas/${idBusinessValue}/comercios`),
          orderBy('id')
        )}
      />
    </Dashboard>
  );
};

export default Business;