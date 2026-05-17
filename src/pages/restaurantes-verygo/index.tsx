import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { Dashboard } from "../../layout/Dashboard/Dashboard";
import { db_client } from "../../firebase/client";

type MainCategory = {
  id: string;
  name: string;
  slug?: string;
  img?: string;
  priority?: number;
  status?: boolean;
  showInHome?: boolean;
  sectoresEconomicos?: Array<DocumentReference | string>;
};

type StoreCandidate = {
  id: string;
  companyId: string;
  commercePath: string;

  name: string;
  logo: string;
  cover: string;
  address: string;
  phone: string;

  city: string;
  citySlug: string;

  sectoresEconomicos: string[];
  raw: DocumentData;
};

type CategoryStoreIndex = {
  id: string;

  categoryId: string;
  categorySlug: string;
  categoryName: string;

  storeId: string;
  storeName: string;
  storeLogo: string;
  storeCover: string;
  storeAddress: string;
  storePhone: string;

  companyId: string;
  commercePath: string;

  city: string;
  citySlug: string;

  sectoresEconomicos: string[];

  status: boolean;
  featured: boolean;
  priority: number;

  hasPromotion?: boolean;
  activePromotionsCount?: number;
};

const DEFAULT_CITY = "Piura";
const COMPANY_ID_FILTER = "5YGeZU3jWdDaPqEFz6m2";

function normalizeText(value: string): string {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function slugify(value: string): string {
  return normalizeText(value)
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getRefOrStringId(value: unknown): string {
  if (!value) return "";

  if (typeof value === "string") {
    return value.includes("/") ? value.split("/").pop() || value : value;
  }

  const maybeRef = value as DocumentReference;

  if (maybeRef?.id) return maybeRef.id;
  if (maybeRef?.path) return maybeRef.path.split("/").pop() || "";

  return "";
}

function getSectorIdsFromArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.map(getRefOrStringId).filter(Boolean);
}

function getCategorySectorIds(category: MainCategory | null): string[] {
  if (!category) return [];

  return getSectorIdsFromArray(category.sectoresEconomicos || []);
}

function parseCompanyIdFromCommercePath(path: string): string {
  const parts = path.split("/");
  const empresasIndex = parts.findIndex((part) => part === "empresas");

  if (empresasIndex >= 0 && parts[empresasIndex + 1]) {
    return parts[empresasIndex + 1];
  }

  return "";
}

function getStoreName(data: DocumentData): string {
  return String(
    data.nombre ||
      data.nickName ||
      data.name ||
      data.nombreComercial ||
      data.storeName ||
      data.businessName ||
      data.razonSocial ||
      data.contentProfile?.nameComercial ||
      "Tienda sin nombre"
  );
}

function getStoreLogo(data: DocumentData): string {
  return String(
    data.logo ||
      data.img ||
      data.image ||
      data.storeLogo ||
      data.urlLogo ||
      data.contentProfile?.logo ||
      ""
  );
}

function getStoreCover(data: DocumentData): string {
  return String(
    data.cover ||
      data.bannerHome ||
      data.banner ||
      data.portada ||
      data.storeCover ||
      data.imgPortada ||
      data.logo ||
      data.img ||
      data.contentProfile?.logo ||
      ""
  );
}

function getStoreAddress(data: DocumentData): string {
  const addressValue = data.address;

  if (typeof addressValue === "string") {
    return addressValue;
  }

  if (addressValue && typeof addressValue === "object") {
    return String(
      addressValue.address ||
        addressValue.description ||
        addressValue.formattedAddress ||
        ""
    );
  }

  return String(
    data.direccion ||
      data.storeAddress ||
      data.ubicacionTexto ||
      data.dataSunat?.direccion ||
      ""
  );
}

function getStorePhone(data: DocumentData): string {
  return String(
    data.phone ||
      data.telefono ||
      data.celular ||
      data.whatsapp ||
      data.storePhone ||
      ""
  );
}

function getStoreCity(data: DocumentData): string {
  const cityValue = data.city;

  if (typeof cityValue === "string") {
    return cityValue || DEFAULT_CITY;
  }

  if (cityValue && typeof cityValue === "object") {
    return String(
      cityValue.admin ||
        cityValue.subadmin ||
        cityValue.locality ||
        cityValue.name ||
        DEFAULT_CITY
    );
  }

  return String(
    data.ciudad ||
      data.localidad ||
      data.provincia ||
      data.cityName ||
      data.dataSunat?.departamento ||
      DEFAULT_CITY
  );
}

function getStoreSectorIds(data: DocumentData): string[] {
  const sectoresEconomicos = getSectorIdsFromArray(data.sectoresEconomicos);

  if (sectoresEconomicos.length > 0) return sectoresEconomicos;

  const sectors = getSectorIdsFromArray(data.sectors);

  if (sectors.length > 0) return sectors;

  const singleSector =
    getRefOrStringId(data.idSectorEconomico) ||
    getRefOrStringId(data.sectorEconomico) ||
    getRefOrStringId(data.idSector) ||
    getRefOrStringId(data.sectorId) ||
    getRefOrStringId(data.sector);

  return singleSector ? [singleSector] : [];
}

function storeMatchesCategory(
  store: StoreCandidate,
  categorySectorIds: string[]
): boolean {
  if (categorySectorIds.length === 0) return true;

  if (store.sectoresEconomicos.length === 0) return false;

  return store.sectoresEconomicos.some((sectorId) =>
    categorySectorIds.includes(sectorId)
  );
}

function buildIndexId(categorySlug: string, storeId: string, citySlug: string) {
  return `${categorySlug}_${storeId}_${citySlug}`;
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm font-semibold text-slate-400">
      {text}
    </div>
  );
}

function StoreAvatar({
  image,
  name,
}: {
  image?: string;
  name: string;
}) {
  return image ? (
    <img
      src={image}
      alt={name}
      className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 bg-slate-100 object-cover"
    />
  ) : (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-400">
      Sin img
    </div>
  );
}

const RestaurantesVeryGoPage = () => {
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [stores, setStores] = useState<StoreCandidate[]>([]);
  const [indexedStores, setIndexedStores] = useState<CategoryStoreIndex[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [city, setCity] = useState(DEFAULT_CITY);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingStores, setLoadingStores] = useState(false);
  const [savingId, setSavingId] = useState("");

  const citySlug = useMemo(() => slugify(city || DEFAULT_CITY), [city]);

  const selectedCategory = useMemo(() => {
    return (
      categories.find((category) => category.id === selectedCategoryId) || null
    );
  }, [categories, selectedCategoryId]);

  const selectedCategorySlug = useMemo(() => {
    if (!selectedCategory) return "";

    return selectedCategory.slug || slugify(selectedCategory.name);
  }, [selectedCategory]);

  const categorySectorIds = useMemo(() => {
    return getCategorySectorIds(selectedCategory);
  }, [selectedCategory]);

  const indexedStoreIds = useMemo(() => {
    return new Set(indexedStores.map((item) => item.storeId));
  }, [indexedStores]);

  const candidateStores = useMemo(() => {
    if (!selectedCategory) return [];

    return stores
      .filter((store) => store.citySlug === citySlug)
      .filter((store) => storeMatchesCategory(store, categorySectorIds))
      .filter((store) => !indexedStoreIds.has(store.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [stores, citySlug, selectedCategory, categorySectorIds, indexedStoreIds]);

  const candidateStoreKeys = useMemo(() => {
    return new Set(candidateStores.map((store) => store.commercePath));
  }, [candidateStores]);

  const manualCandidateStores = useMemo(() => {
    if (!selectedCategory) return [];

    return stores
      .filter((store) => store.citySlug === citySlug)
      .filter((store) => !indexedStoreIds.has(store.id))
      .filter((store) => !candidateStoreKeys.has(store.commercePath))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [
    stores,
    citySlug,
    selectedCategory,
    indexedStoreIds,
    candidateStoreKeys,
  ]);

  const sortedIndexedStores = useMemo(() => {
    return [...indexedStores].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;

      return Number(a.priority || 99) - Number(b.priority || 99);
    });
  }, [indexedStores]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);

      const snap = await getDocs(collection(db_client, "main_categories"));

      const data = snap.docs
        .map((docSnap) => {
          const category = docSnap.data() as MainCategory;

          return {
            ...category,
            id: category.id || docSnap.id,
          };
        })
        .filter((category) => category.status !== false)
        .sort((a, b) => Number(a.priority || 99) - Number(b.priority || 99));

      setCategories(data);

      if (!selectedCategoryId && data[0]) {
        setSelectedCategoryId(data[0].id);
      }
    } catch (error: any) {
      console.error("LOAD_MAIN_CATEGORIES_ERROR:", {
        code: error?.code,
        message: error?.message,
        error,
      });

      toast.error(
        error?.code === "permission-denied"
          ? "Sin permisos para leer main_categories."
          : "No se pudieron cargar las categorías."
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadStores = async () => {
    try {
      setLoadingStores(true);

      const storesCollectionRef = COMPANY_ID_FILTER
        ? collection(db_client, "empresas", COMPANY_ID_FILTER, "comercios")
        : collectionGroup(db_client, "comercios");

      const snap = await getDocs(storesCollectionRef);

      const data = snap.docs.map((docSnap) => {
        const storeData = docSnap.data();
        const commercePath = docSnap.ref.path;

        const companyId =
          String(storeData.idCompany || storeData.companyId || "") ||
          parseCompanyIdFromCommercePath(commercePath) ||
          COMPANY_ID_FILTER;

        const storeCity = getStoreCity(storeData);

        const store: StoreCandidate = {
          id: String(storeData.id || docSnap.id),
          companyId,
          commercePath,

          name: getStoreName(storeData),
          logo: getStoreLogo(storeData),
          cover: getStoreCover(storeData),
          address: getStoreAddress(storeData),
          phone: getStorePhone(storeData),

          city: storeCity,
          citySlug: slugify(storeCity),

          sectoresEconomicos: getStoreSectorIds(storeData),
          raw: storeData,
        };

        console.log("STORE_PARSED:", {
          id: store.id,
          name: store.name,
          city: store.city,
          citySlug: store.citySlug,
          sectoresEconomicos: store.sectoresEconomicos,
          commercePath: store.commercePath,
        });

        return store;
      });

      console.log("VERYGO_STORES_LOADED:", data);

      setStores(data);
    } catch (error: any) {
      console.error("LOAD_STORES_ERROR:", {
        code: error?.code,
        message: error?.message,
        error,
      });

      toast.error(
        error?.code === "permission-denied"
          ? "Sin permisos para leer comercios."
          : "No se pudieron cargar los restaurantes."
      );
    } finally {
      setLoadingStores(false);
    }
  };

  const loadIndexedStores = async () => {
    if (!selectedCategorySlug || !citySlug) {
      setIndexedStores([]);
      return;
    }

    try {
      setLoadingStores(true);

      const q = query(
        collection(db_client, "category_store_index"),
        where("categorySlug", "==", selectedCategorySlug),
        where("citySlug", "==", citySlug)
      );

      const snap = await getDocs(q);

      const data = snap.docs.map((docSnap) => {
        const item = docSnap.data() as CategoryStoreIndex;

        return {
          ...item,
          id: item.id || docSnap.id,
        };
      });

      console.log("VERYGO_INDEXED_STORES_LOADED:", data);

      setIndexedStores(data);
    } catch (error: any) {
      console.error("LOAD_INDEXED_STORES_ERROR:", {
        code: error?.code,
        message: error?.message,
        error,
      });

      toast.error(
        error?.code === "permission-denied"
          ? "Sin permisos para leer category_store_index."
          : "No se pudieron cargar los restaurantes indexados."
      );
    } finally {
      setLoadingStores(false);
    }
  };

  const addStoreToVeryGo = async (store: StoreCandidate) => {
    if (!selectedCategory) {
      toast.error("Selecciona una categoría.");
      return;
    }

    const categorySlug = selectedCategory.slug || slugify(selectedCategory.name);
    const indexId = buildIndexId(categorySlug, store.id, citySlug);

    try {
      setSavingId(store.id);

      const item: CategoryStoreIndex = {
        id: indexId,

        categoryId: selectedCategory.id,
        categorySlug,
        categoryName: selectedCategory.name,

        storeId: store.id,
        storeName: store.name,
        storeLogo: store.logo,
        storeCover: store.cover,
        storeAddress: store.address,
        storePhone: store.phone,

        companyId: store.companyId,
        commercePath: store.commercePath,

        city,
        citySlug,

        sectoresEconomicos: store.sectoresEconomicos,

        status: true,
        featured: false,
        priority: 99,

        hasPromotion: false,
        activePromotionsCount: 0,
      };

      await setDoc(doc(db_client, "category_store_index", indexId), {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success("Restaurante agregado a VeryGo.");

      await loadIndexedStores();
    } catch (error: any) {
      console.error("ADD_STORE_TO_INDEX_ERROR:", {
        code: error?.code,
        message: error?.message,
        error,
      });

      toast.error(
        error?.code === "permission-denied"
          ? "Sin permisos para guardar en category_store_index."
          : "No se pudo agregar el restaurante."
      );
    } finally {
      setSavingId("");
    }
  };

  const updatePriority = async (item: CategoryStoreIndex) => {
    const input = window.prompt(
      "Ingresa la prioridad. Menor número aparece primero.",
      String(item.priority || 99)
    );

    if (!input) return;

    const priority = Number(input);

    if (!Number.isFinite(priority) || priority <= 0) {
      toast.error("Prioridad inválida.");
      return;
    }

    try {
      setSavingId(item.id);

      await updateDoc(doc(db_client, "category_store_index", item.id), {
        priority,
        updatedAt: serverTimestamp(),
      });

      toast.success("Prioridad actualizada.");

      await loadIndexedStores();
    } catch (error: any) {
      console.error("UPDATE_PRIORITY_ERROR:", {
        code: error?.code,
        message: error?.message,
        error,
      });

      toast.error("No se pudo actualizar la prioridad.");
    } finally {
      setSavingId("");
    }
  };

  const toggleFeatured = async (item: CategoryStoreIndex) => {
    try {
      setSavingId(item.id);

      await updateDoc(doc(db_client, "category_store_index", item.id), {
        featured: !item.featured,
        updatedAt: serverTimestamp(),
      });

      toast.success(
        item.featured
          ? "Restaurante quitado de destacados."
          : "Restaurante marcado como destacado."
      );

      await loadIndexedStores();
    } catch (error: any) {
      console.error("TOGGLE_FEATURED_ERROR:", {
        code: error?.code,
        message: error?.message,
        error,
      });

      toast.error("No se pudo actualizar destacado.");
    } finally {
      setSavingId("");
    }
  };

  const toggleStatus = async (item: CategoryStoreIndex) => {
    try {
      setSavingId(item.id);

      await updateDoc(doc(db_client, "category_store_index", item.id), {
        status: !item.status,
        updatedAt: serverTimestamp(),
      });

      toast.success(
        item.status
          ? "Restaurante ocultado de VeryGo."
          : "Restaurante activado en VeryGo."
      );

      await loadIndexedStores();
    } catch (error: any) {
      console.error("TOGGLE_STATUS_ERROR:", {
        code: error?.code,
        message: error?.message,
        error,
      });

      toast.error("No se pudo actualizar estado.");
    } finally {
      setSavingId("");
    }
  };

  const removeFromIndex = async (item: CategoryStoreIndex) => {
    const confirmDelete = window.confirm(
      `¿Seguro que deseas quitar "${item.storeName}" de esta categoría?`
    );

    if (!confirmDelete) return;

    try {
      setSavingId(item.id);

      await deleteDoc(doc(db_client, "category_store_index", item.id));

      toast.success("Restaurante quitado de la categoría.");

      await loadIndexedStores();
    } catch (error: any) {
      console.error("REMOVE_INDEX_ERROR:", {
        code: error?.code,
        message: error?.message,
        error,
      });

      toast.error("No se pudo quitar el restaurante.");
    } finally {
      setSavingId("");
    }
  };

  useEffect(() => {
    loadCategories();
    loadStores();
  }, []);

  useEffect(() => {
    loadIndexedStores();
  }, [selectedCategorySlug, citySlug]);

  return (
    <Dashboard>
      <div className="mx-auto w-full max-w-[1500px] pb-10">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
            Restaurantes VeryGo
          </h1>

          <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
            Configura qué restaurantes aparecen por categoría, ciudad y prioridad.
          </p>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600 sm:text-sm">
              Categoría principal
            </label>

            <select
              value={selectedCategoryId}
              onChange={(event) => setSelectedCategoryId(event.target.value)}
              className="select select-bordered w-full text-sm"
              disabled={loadingCategories}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} - prioridad {category.priority || 99}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600 sm:text-sm">
              Ciudad
            </label>

            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="input input-bordered w-full text-sm"
              placeholder="Piura"
            />
          </div>
        </div>

        {selectedCategory && (
          <div className="mb-5 rounded-2xl border border-orange-200 bg-orange-50 p-3 sm:p-4">
            <h2 className="text-sm font-bold text-orange-800 sm:text-base">
              {selectedCategory.name}
            </h2>

            <p className="mt-1 break-words text-xs font-medium text-orange-700 sm:text-sm">
              Slug: {selectedCategorySlug} · Sectores relacionados:{" "}
              {categorySectorIds.length > 0
                ? categorySectorIds.join(", ")
                : "Sin sectores"}
            </p>
          </div>
        )}

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] font-bold uppercase text-slate-400">
              Comercios
            </p>
            <p className="text-lg font-black text-slate-800">{stores.length}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] font-bold uppercase text-slate-400">
              Automáticos
            </p>
            <p className="text-lg font-black text-slate-800">
              {candidateStores.length}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] font-bold uppercase text-slate-400">
              Manuales
            </p>
            <p className="text-lg font-black text-slate-800">
              {manualCandidateStores.length}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] font-bold uppercase text-slate-400">
              Indexados
            </p>
            <p className="text-lg font-black text-slate-800">
              {indexedStores.length}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] font-bold uppercase text-slate-400">
              Ciudad
            </p>
            <p className="truncate text-sm font-black text-slate-800">
              {citySlug}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] font-bold uppercase text-slate-400">
              Empresa
            </p>
            <p className="truncate text-sm font-black text-slate-800">
              {COMPANY_ID_FILTER || "Todas"}
            </p>
          </div>
        </div>

        <section className="mb-8">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800 sm:text-lg">
                Restaurantes en VeryGo
              </h2>

              <p className="text-xs text-slate-500 sm:text-sm">
                Estos ya aparecerán en la categoría seleccionada.
              </p>
            </div>

            {loadingStores && (
              <span className="text-xs font-semibold text-slate-400 sm:text-sm">
                Cargando...
              </span>
            )}
          </div>

          <div className="hidden overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Restaurante</th>
                  <th>Ciudad</th>
                  <th>Prioridad</th>
                  <th>Destacado</th>
                  <th>Estado</th>
                  <th>Promos</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {sortedIndexedStores.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="py-6 text-center text-sm font-semibold text-slate-400">
                        Aún no hay restaurantes agregados para esta categoría.
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedIndexedStores.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <StoreAvatar
                            image={item.storeLogo}
                            name={item.storeName}
                          />

                          <div>
                            <p className="font-bold text-slate-800">
                              {item.storeName}
                            </p>

                            <p className="max-w-[260px] truncate text-xs text-slate-500">
                              {item.storeAddress || item.commercePath}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td>{item.city}</td>

                      <td>
                        <button
                          type="button"
                          disabled={savingId === item.id}
                          onClick={() => updatePriority(item)}
                          className="badge badge-outline cursor-pointer font-bold"
                        >
                          {item.priority || 99}
                        </button>
                      </td>

                      <td>
                        {item.featured ? (
                          <span className="badge badge-warning text-white">
                            Destacado
                          </span>
                        ) : (
                          <span className="badge bg-slate-200 text-slate-600">
                            Normal
                          </span>
                        )}
                      </td>

                      <td>
                        {item.status ? (
                          <span className="badge badge-success text-white">
                            Activo
                          </span>
                        ) : (
                          <span className="badge badge-error text-white">
                            Oculto
                          </span>
                        )}
                      </td>

                      <td>
                        {item.hasPromotion ? (
                          <span className="badge badge-info text-white">
                            {item.activePromotionsCount || 1} promo
                          </span>
                        ) : (
                          <span className="badge bg-slate-200 text-slate-600">
                            Sin promo
                          </span>
                        )}
                      </td>

                      <td>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={savingId === item.id}
                            onClick={() => toggleFeatured(item)}
                            className="btn btn-xs btn-warning text-white"
                          >
                            {item.featured ? "Quitar destacado" : "Destacar"}
                          </button>

                          <button
                            type="button"
                            disabled={savingId === item.id}
                            onClick={() => toggleStatus(item)}
                            className={`btn btn-xs ${
                              item.status ? "btn-error" : "btn-success"
                            } text-white`}
                          >
                            {item.status ? "Ocultar" : "Activar"}
                          </button>

                          <button
                            type="button"
                            disabled={savingId === item.id}
                            onClick={() => removeFromIndex(item)}
                            className="btn btn-xs btn-outline btn-error"
                          >
                            Quitar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 lg:hidden">
            {sortedIndexedStores.length === 0 ? (
              <EmptyState text="Aún no hay restaurantes agregados para esta categoría." />
            ) : (
              sortedIndexedStores.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex gap-3">
                    <StoreAvatar image={item.storeLogo} name={item.storeName} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-slate-800">
                        {item.storeName}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-500">
                        {item.storeAddress || item.commercePath}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="badge badge-outline">{item.city}</span>

                        {item.featured ? (
                          <span className="badge badge-warning text-white">
                            Destacado
                          </span>
                        ) : (
                          <span className="badge bg-slate-200 text-slate-600">
                            Normal
                          </span>
                        )}

                        {item.status ? (
                          <span className="badge badge-success text-white">
                            Activo
                          </span>
                        ) : (
                          <span className="badge badge-error text-white">
                            Oculto
                          </span>
                        )}

                        <button
                          type="button"
                          disabled={savingId === item.id}
                          onClick={() => updatePriority(item)}
                          className="badge badge-outline cursor-pointer font-bold"
                        >
                          Prioridad {item.priority || 99}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      disabled={savingId === item.id}
                      onClick={() => toggleFeatured(item)}
                      className="btn btn-xs btn-warning text-white"
                    >
                      {item.featured ? "Quitar destacado" : "Destacar"}
                    </button>

                    <button
                      type="button"
                      disabled={savingId === item.id}
                      onClick={() => toggleStatus(item)}
                      className={`btn btn-xs ${
                        item.status ? "btn-error" : "btn-success"
                      } text-white`}
                    >
                      {item.status ? "Ocultar" : "Activar"}
                    </button>

                    <button
                      type="button"
                      disabled={savingId === item.id}
                      onClick={() => removeFromIndex(item)}
                      className="btn btn-xs btn-outline btn-error"
                    >
                      Quitar
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-3">
            <h2 className="text-base font-bold text-slate-800 sm:text-lg">
              Restaurantes candidatos
            </h2>

            <p className="text-xs text-slate-500 sm:text-sm">
              Restaurantes de la ciudad y sectores relacionados que todavía no
              están agregados a esta categoría.
            </p>
          </div>

          <div className="hidden overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Restaurante</th>
                  <th>Empresa</th>
                  <th>Ciudad</th>
                  <th>Sectores</th>
                  <th>Ruta</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {candidateStores.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="py-6 text-center text-sm font-semibold text-slate-400">
                        No hay restaurantes candidatos automáticos para esta
                        categoría o ciudad.
                      </div>
                    </td>
                  </tr>
                ) : (
                  candidateStores.map((store) => (
                    <tr key={store.commercePath}>
                      <td>
                        <div className="flex items-center gap-3">
                          <StoreAvatar image={store.logo} name={store.name} />

                          <div>
                            <p className="font-bold text-slate-800">
                              {store.name}
                            </p>

                            <p className="max-w-[260px] truncate text-xs text-slate-500">
                              {store.address || "Sin dirección"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="text-xs font-semibold text-slate-500">
                          {store.companyId || "Sin empresa"}
                        </span>
                      </td>

                      <td>{store.city}</td>

                      <td>
                        <span className="text-xs font-semibold text-slate-500">
                          {store.sectoresEconomicos.length > 0
                            ? store.sectoresEconomicos.join(", ")
                            : "Sin sectores"}
                        </span>
                      </td>

                      <td>
                        <span className="max-w-[280px] truncate text-xs text-slate-400">
                          {store.commercePath}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          disabled={savingId === store.id}
                          onClick={() => addStoreToVeryGo(store)}
                          className="btn btn-xs btn-primary"
                        >
                          {savingId === store.id
                            ? "Agregando..."
                            : "Agregar a VeryGo"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 lg:hidden">
            {candidateStores.length === 0 ? (
              <EmptyState text="No hay restaurantes candidatos automáticos para esta categoría o ciudad." />
            ) : (
              candidateStores.map((store) => (
                <article
                  key={store.commercePath}
                  className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex gap-3">
                    <StoreAvatar image={store.logo} name={store.name} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-slate-800">
                        {store.name}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-500">
                        {store.address || "Sin dirección"}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="badge badge-outline">{store.city}</span>
                        <span className="badge bg-slate-200 text-slate-600">
                          {store.companyId || "Sin empresa"}
                        </span>
                      </div>

                      <p className="mt-2 break-words text-[11px] font-semibold text-slate-400">
                        Sectores:{" "}
                        {store.sectoresEconomicos.length > 0
                          ? store.sectoresEconomicos.join(", ")
                          : "Sin sectores"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={savingId === store.id}
                    onClick={() => addStoreToVeryGo(store)}
                    className="btn btn-sm btn-primary mt-3 w-full"
                  >
                    {savingId === store.id
                      ? "Agregando..."
                      : "Agregar a VeryGo"}
                  </button>
                </article>
              ))
            )}
          </div>
        </section>

        {manualCandidateStores.length > 0 && (
          <section>
            <div className="mb-3">
              <h2 className="text-base font-bold text-slate-800 sm:text-lg">
                Asignación manual de restaurantes
              </h2>

              <p className="text-xs text-slate-500 sm:text-sm">
                Estos comercios están en la ciudad seleccionada, pero no coinciden
                con los sectores de la categoría. Puedes agregarlos manualmente si
                deseas que aparezcan en esta categoría.
              </p>
            </div>

            <div className="hidden overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Restaurante</th>
                    <th>Empresa</th>
                    <th>Ciudad</th>
                    <th>Sector actual</th>
                    <th>Ruta</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {manualCandidateStores.map((store) => (
                    <tr key={store.commercePath}>
                      <td>
                        <div className="flex items-center gap-3">
                          <StoreAvatar image={store.logo} name={store.name} />

                          <div>
                            <p className="font-bold text-slate-800">
                              {store.name}
                            </p>

                            <p className="max-w-[260px] truncate text-xs text-slate-500">
                              {store.address || "Sin dirección"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="text-xs font-semibold text-slate-500">
                          {store.companyId || "Sin empresa"}
                        </span>
                      </td>

                      <td>{store.city}</td>

                      <td>
                        <span className="text-xs font-semibold text-slate-500">
                          {store.sectoresEconomicos.length > 0
                            ? store.sectoresEconomicos.join(", ")
                            : "Sin sector"}
                        </span>
                      </td>

                      <td>
                        <span className="max-w-[280px] truncate text-xs text-slate-400">
                          {store.commercePath}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          disabled={savingId === store.id}
                          onClick={() => addStoreToVeryGo(store)}
                          className="btn btn-xs btn-outline btn-primary"
                        >
                          {savingId === store.id
                            ? "Agregando..."
                            : "Agregar manual"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 lg:hidden">
              {manualCandidateStores.map((store) => (
                <article
                  key={store.commercePath}
                  className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex gap-3">
                    <StoreAvatar image={store.logo} name={store.name} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-slate-800">
                        {store.name}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-500">
                        {store.address || "Sin dirección"}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="badge badge-outline">{store.city}</span>
                        <span className="badge bg-slate-200 text-slate-600">
                          Manual
                        </span>
                      </div>

                      <p className="mt-2 break-words text-[11px] font-semibold text-slate-400">
                        Sector actual:{" "}
                        {store.sectoresEconomicos.length > 0
                          ? store.sectoresEconomicos.join(", ")
                          : "Sin sector"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={savingId === store.id}
                    onClick={() => addStoreToVeryGo(store)}
                    className="btn btn-sm btn-outline btn-primary mt-3 w-full"
                  >
                    {savingId === store.id
                      ? "Agregando..."
                      : "Agregar manual"}
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </Dashboard>
  );
};

export default RestaurantesVeryGoPage;