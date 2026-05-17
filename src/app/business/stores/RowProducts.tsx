import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentReference,
} from "firebase/firestore";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Swal, { type SweetAlertOptions } from "sweetalert2";

import { db_client } from "../../../firebase/client";
import { Product } from "../../../types/product";

interface Category {
  name: string;
}

type ProductWithValidation = Product & {
  verified?: boolean;
  verfied?: boolean;
  availability?: string;
  status?: boolean;
  validatedAt?: unknown;
  validationSource?: string;
  validationStatus?: string;
  verificationSort?: number;
  rejectedReason?: string;
  rejectedAt?: unknown;
};

type ProductTypeWithRefs = {
  id?: string;
  name?: string;
  price?: number;
  oldPrice?: number;
  status?: boolean;
  rejectedAt?: unknown;
  validationSource?: string;
  adicionales?: Array<{
    id?: string;
    reference?: DocumentReference;
  }>;
};

type PreviewToppingItem = {
  id: string;
  name: string;
  price: number;
  status: boolean;
};

type PreviewToppingGroup = {
  id: string;
  name: string;
  limit: number;
  status: boolean;
  reference: DocumentReference;
  items: PreviewToppingItem[];
};

type PreviewProductType = {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  status: boolean;
  toppings: PreviewToppingGroup[];
};

type SelectedToppingsState = Record<string, string[]>;

interface ProductDetailsModalProps {
  product: ProductWithValidation;
  categoryName: string;
  previewTypes: PreviewProductType[];
  onClose: () => void;
  onValidate: () => void;
  onRejectProduct: () => void;
  onDisableToppingGroup: (
    typeId: string,
    group: PreviewToppingGroup
  ) => void;
  onDisableToppingItem: (
    group: PreviewToppingGroup,
    item: PreviewToppingItem
  ) => void;
  validating: boolean;
  rejecting: boolean;
  actionLoadingKey: string;
  validated: boolean;
}

function formatCurrency(value?: number): string {
  return `S/. ${Number(value || 0).toFixed(2)}`;
}

function getProductAvailability(product: ProductWithValidation): string {
  return String(product.availability || "SIN_ESTADO").toUpperCase();
}

function isProductValidated(product: ProductWithValidation): boolean {
  return product.verified === true;
}

function isProductVisibleInVeryGo(product: ProductWithValidation): boolean {
  return (
    product.status === true &&
    product.verified === true &&
    getProductAvailability(product) === "DISPONIBLE"
  );
}

function getVisibilityReasons(product: ProductWithValidation): string[] {
  const reasons: string[] = [];
  const availability = getProductAvailability(product);

  if (product.status !== true) {
    reasons.push("El producto tiene status diferente de true.");
  }

  if (product.verified !== true) {
    reasons.push("El producto aún no está validado por Rangers.");
  }

  if (availability !== "DISPONIBLE") {
    reasons.push(`El producto tiene availability: ${availability}.`);
  }

  return reasons;
}

function getStatusBadge(product: ProductWithValidation) {
  const availability = getProductAvailability(product);

  if (product.status !== true) {
    return {
      label: "Inactivo",
      className: "bg-slate-100 text-slate-600 border-slate-200",
    };
  }

  if (availability === "DISPONIBLE") {
    return {
      label: "Disponible",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }

  if (availability === "AGOTADO") {
    return {
      label: "Agotado",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    };
  }

  if (availability === "INACTIVO") {
    return {
      label: "Inactivo",
      className: "bg-slate-100 text-slate-600 border-slate-200",
    };
  }

  return {
    label: availability,
    className: "bg-slate-100 text-slate-600 border-slate-200",
  };
}

function fireSwalAboveModal(options: SweetAlertOptions) {
  const originalDidOpen = options.didOpen;

  return Swal.fire({
    ...options,
    didOpen: (popup) => {
      const swalContainer = document.querySelector(
        ".swal2-container"
      ) as HTMLElement | null;

      if (swalContainer) {
        swalContainer.style.zIndex = "100000";
      }

      if (originalDidOpen) {
        originalDidOpen(popup);
      }
    },
  });
}

function getActiveTypes(product: ProductWithValidation): ProductTypeWithRefs[] {
  if (!Array.isArray(product.tipos)) return [];

  return (product.tipos as ProductTypeWithRefs[]).filter(
    (type) => type.status !== false
  );
}

async function getToppingGroupFromReference(
  reference?: DocumentReference
): Promise<PreviewToppingGroup | null> {
  if (!reference) return null;

  try {
    const snap = await getDoc(reference);

    if (!snap.exists()) return null;

    const data = snap.data() as any;

    if (data?.removed === true || data?.status === false) {
      return null;
    }

    const rawItems = Array.isArray(data.items) ? data.items : [];

    const items: PreviewToppingItem[] = rawItems
  .map((item: any, index: number): PreviewToppingItem => {
    return {
      id: String(item.id || `${snap.id}-${index}`),
      name: String(item.name || "Adicional"),
      price: Number(item.price || 0),
      status: item.status !== false,
    };
  })
  .filter((item: PreviewToppingItem) => item.status === true);

    if (items.length === 0) return null;

    return {
      id: String(data.id || snap.id),
      name: String(data.name || "Adicionales"),
      limit: Number(data.limit || 0),
      status: data.status !== false,
      reference,
      items,
    };
  } catch (error) {
    console.error("GET_TOPPING_GROUP_REFERENCE_ERROR:", error);
    return null;
  }
}

async function buildPreviewTypes(
  product: ProductWithValidation
): Promise<PreviewProductType[]> {
  const activeTypes = getActiveTypes(product);

  const mappedTypes = await Promise.all(
    activeTypes.map(async (type, index) => {
      const typeId = String(type.id || `type-${index}`);

      const toppingRefs = Array.isArray(type.adicionales)
        ? type.adicionales
        : [];

      const toppingGroups = await Promise.all(
        toppingRefs.map((toppingRef) =>
          getToppingGroupFromReference(toppingRef.reference)
        )
      );

      return {
        id: typeId,
        name: String(type.name || "Precio único"),
        price: Number(type.price || 0),
        oldPrice: Number(type.oldPrice || 0),
        status: type.status !== false,
        toppings: toppingGroups.filter(Boolean) as PreviewToppingGroup[],
      };
    })
  );

  return mappedTypes.filter((type) => type.status);
}

function getSelectedToppingItems(
  productType: PreviewProductType | null,
  selectedToppings: SelectedToppingsState
): PreviewToppingItem[] {
  if (!productType) return [];

  const selectedItems: PreviewToppingItem[] = [];

  productType.toppings.forEach((group) => {
    const selectedIds = selectedToppings[group.id] || [];

    group.items.forEach((item) => {
      if (selectedIds.includes(item.id)) {
        selectedItems.push(item);
      }
    });
  });

  return selectedItems;
}

function ProductDetailsModal({
  product,
  categoryName,
  previewTypes,
  onClose,
  onValidate,
  onRejectProduct,
  onDisableToppingGroup,
  onDisableToppingItem,
  validating,
  rejecting,
  actionLoadingKey,
  validated,
}: ProductDetailsModalProps) {
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [selectedToppings, setSelectedToppings] =
    useState<SelectedToppingsState>({});
  const [quantity, setQuantity] = useState(1);

  const selectedProductType = useMemo(() => {
    if (previewTypes.length === 0) return null;

    if (!selectedTypeId) return previewTypes[0];

    return (
      previewTypes.find((type) => type.id === selectedTypeId) || previewTypes[0]
    );
  }, [previewTypes, selectedTypeId]);

  const selectedToppingItems = useMemo(() => {
    return getSelectedToppingItems(selectedProductType, selectedToppings);
  }, [selectedProductType, selectedToppings]);

  const basePrice = Number(selectedProductType?.price || 0);

  const extrasUnitTotal = selectedToppingItems.reduce((sum, item) => {
    return sum + Number(item.price || 0);
  }, 0);

  const unitTotal = basePrice + extrasUnitTotal;
  const grandTotal = unitTotal * quantity;

  const visibleInVeryGo = isProductVisibleInVeryGo(product);
  const visibilityReasons = getVisibilityReasons(product);
  const availability = getProductAvailability(product);

  useEffect(() => {
    if (previewTypes.length > 0) {
      setSelectedTypeId(previewTypes[0].id);
      setSelectedToppings({});
    }
  }, [previewTypes]);

  const handleSelectType = (typeId: string) => {
    setSelectedTypeId(typeId);
    setSelectedToppings({});
  };

  const toggleTopping = (
    group: PreviewToppingGroup,
    item: PreviewToppingItem
  ) => {
    setSelectedToppings((prev) => {
      const currentSelectedIds = prev[group.id] || [];
      const alreadySelected = currentSelectedIds.includes(item.id);

      if (alreadySelected) {
        return {
          ...prev,
          [group.id]: currentSelectedIds.filter((id) => id !== item.id),
        };
      }

      if (group.limit > 0 && currentSelectedIds.length >= group.limit) {
        const nextSelectedIds = [...currentSelectedIds.slice(1), item.id];

        return {
          ...prev,
          [group.id]: nextSelectedIds,
        };
      }

      return {
        ...prev,
        [group.id]: [...currentSelectedIds, item.id],
      };
    });
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[94vh] w-full max-w-6xl overflow-hidden rounded-[2rem] bg-[#f8fafc] shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">
              Vista previa VeryGo
            </p>

            <h2 className="mt-1 text-xl font-extrabold text-slate-950">
              {product.name || "Producto sin nombre"}
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Revisión visual y acciones de control antes de aprobar.
            </p>
          </div>

          <button
            type="button"
            className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
            onClick={onClose}
          >
            Cerrar
          </button>
        </header>

        <main className="max-h-[calc(94vh-150px)] overflow-y-auto p-5">
          <div className="grid gap-5 lg:grid-cols-[390px_1fr]">
            <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
              <div className="relative h-[310px] bg-slate-200">
                {product.img ? (
                  <img
                    src={product.img}
                    alt={product.name || "Producto"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm font-bold text-slate-500">
                    Sin imagen
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />

                <div className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-red-600 shadow-lg">
                  {validated ? "Producto validado" : "Pendiente de validación"}
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h1 className="text-3xl font-black leading-tight text-white drop-shadow">
                    {product.name || "Producto sin nombre"}
                  </h1>

                  <p className="mt-1 text-sm font-bold text-white/90">
                    {categoryName || "Sin categoría"}
                  </p>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Precio seleccionado
                    </p>

                    <strong className="mt-1 block text-3xl font-black text-red-600">
                      {formatCurrency(unitTotal)}
                    </strong>

                    {extrasUnitTotal > 0 && (
                      <p className="mt-1 text-xs font-bold text-slate-500">
                        Incluye {formatCurrency(extrasUnitTotal)} en adicionales
                      </p>
                    )}
                  </div>

                  <div
                    className={`rounded-2xl border px-3 py-2 text-xs font-black ${
                      visibleInVeryGo
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    }`}
                  >
                    {visibleInVeryGo ? "Visible en VeryGo" : "No visible"}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {product.descripcion || "Sin descripción registrada."}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-slate-50 p-3 text-center">
                    <span className="text-lg">⏱️</span>
                    <p className="mt-1 text-xs font-bold text-slate-600">
                      20-30 min
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3 text-center">
                    <span className="text-lg">⭐</span>
                    <p className="mt-1 text-xs font-bold text-slate-600">
                      4.8
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3 text-center">
                    <span className="text-lg">🔥</span>
                    <p className="mt-1 text-xs font-bold text-slate-600">
                      Popular
                    </p>
                  </div>
                </div>

                {!visibleInVeryGo && visibilityReasons.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-black text-amber-800">
                      Motivos por los que aún no aparecerá:
                    </p>

                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-semibold text-amber-700">
                      {visibilityReasons.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-4">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-950">
                      Elige una opción
                    </h3>

                    <p className="text-sm font-medium text-slate-500">
                      Así seleccionará el precio el cliente.
                    </p>
                  </div>

                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-red-600">
                    Requerido
                  </span>
                </div>

                {previewTypes.length > 0 ? (
                  <div className="space-y-3">
                    {previewTypes.map((type) => {
                      const checked = selectedProductType?.id === type.id;

                      return (
                        <label
                          key={type.id}
                          className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border px-4 py-4 transition ${
                            checked
                              ? "border-red-300 bg-red-50"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          }`}
                        >
                          <div>
                            <span className="block text-sm font-black text-slate-900">
                              {type.name || "Precio único"}
                            </span>

                            {type.toppings.length > 0 && (
                              <span className="mt-1 block text-xs font-bold text-slate-500">
                                {type.toppings.length} grupo
                                {type.toppings.length > 1 ? "s" : ""} de
                                adicionales
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center justify-end gap-3">
  {type.oldPrice > type.price && (
    <span className="text-xs font-bold text-slate-400 line-through">
      {formatCurrency(type.oldPrice)}
    </span>
  )}

  <span className="text-sm font-black text-slate-900">
    {formatCurrency(type.price)}
  </span>

  <input
    type="radio"
    checked={checked}
    onChange={() => handleSelectType(type.id)}
    className="h-4 w-4 accent-red-600"
  />
</div>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-700">
                    Este producto no tiene precios activos configurados.
                  </div>
                )}
              </div>

              {selectedProductType &&
                selectedProductType.toppings.map((group) => {
                  const selectedIds = selectedToppings[group.id] || [];

                  return (
                    <div
                      key={group.id}
                      className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl"
                    >
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-lg font-black text-slate-950">
                          {group.name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                            {group.limit === 0
                              ? "Elige los que quieras"
                              : `Máximo ${group.limit}`}
                          </span>

                          <button
                            type="button"
                            className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-black text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                           onClick={() => {
  if (!selectedProductType) return;
  onDisableToppingGroup(selectedProductType.id, group);
}}
                            disabled={actionLoadingKey === `group-${group.id}`}
                          >
                            {actionLoadingKey === `group-${group.id}`
                              ? "Anulando..."
                              : "Anular grupo"}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {group.items.map((item) => {
                          const checked = selectedIds.includes(item.id);
                          const disabled =
                            !checked &&
                            group.limit > 0 &&
                            selectedIds.length >= group.limit;

                          return (
                            <label
                              key={item.id}
                              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 transition ${
                                checked
                                  ? "border-red-300 bg-red-50"
                                  : "border-slate-200 bg-white"
                              } ${
                                disabled
                                  ? "cursor-not-allowed opacity-50"
                                  : "cursor-pointer hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-lg">➕</span>

                                <span className="text-sm font-black text-slate-900">
                                  {item.name}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center justify-end gap-3">
                                <span className="text-sm font-black text-slate-700">
                                  +{formatCurrency(item.price)}
                                </span>

                                <button
                                  type="button"
                                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    onDisableToppingItem(group, item);
                                  }}
                                  disabled={
                                    actionLoadingKey ===
                                    `item-${group.id}-${item.id}`
                                  }
                                >
                                  {actionLoadingKey ===
                                  `item-${group.id}-${item.id}`
                                    ? "Anulando..."
                                    : "Anular"}
                                </button>

                                <input
                                  type="checkbox"
                                  checked={checked}
                                  disabled={disabled}
                                  onChange={() => toggleTopping(group, item)}
                                  className="h-4 w-4 accent-red-600"
                                />
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

              {selectedProductType &&
                selectedProductType.toppings.length === 0 && (
                  <div className="rounded-[2rem] border border-slate-200 bg-white p-5 text-sm font-bold text-slate-500 shadow-xl">
                    Esta opción no tiene adicionales disponibles.
                  </div>
                )}

              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl">
                <h3 className="text-lg font-black text-slate-950">
                  Indicaciones especiales
                </h3>

                <textarea
                  disabled
                  className="mt-3 min-h-[95px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
                  placeholder="Ejemplo: sin cebolla, más ají, enviar cubiertos..."
                />
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl">
                <div className="mb-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase text-slate-400">
                      Estado
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-800">
                      status: {String(product.status)}
                    </p>

                    <p className="text-sm font-black text-slate-800">
                      availability: {availability}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase text-slate-400">
                      Verificación
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-800">
                      verified: {String(product.verified)}
                    </p>

                    <p className="text-sm font-black text-slate-800">
                      verfied: {String(product.verfied)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase text-slate-400">
                      Resultado
                    </p>

                    <p
                      className={`mt-1 text-sm font-black ${
                        visibleInVeryGo ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      {visibleInVeryGo
                        ? "Aparecerá en VeryGo"
                        : "Aún no aparecerá"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-950 p-4 text-white">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 font-black"
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                    >
                      -
                    </button>

                    <span className="text-lg font-black">{quantity}</span>

                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 font-black"
                      onClick={() => setQuantity((prev) => prev + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled
                    className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white opacity-90"
                  >
                    Agregar al carrito • {formatCurrency(grandTotal)}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </main>

        <footer className="flex flex-wrap justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
          <button
            type="button"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onRejectProduct}
            disabled={rejecting}
          >
            {rejecting ? "Anulando..." : "Anular producto"}
          </button>

          <button
            type="button"
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
            onClick={onClose}
          >
            Cancelar
          </button>

          {!validated && (
            <button
              type="button"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={onValidate}
              disabled={validating}
            >
              {validating ? "Validando..." : "Validar producto"}
            </button>
          )}
        </footer>
      </div>
    </div>,
    document.body
  );
}

export const RowProducts = ({ values }: { values: ProductWithValidation }) => {
  const router = useRouter();
  const { idBusiness, idComercio } = router.query;

  const [nameCategoria, setNameCategoria] = useState("");
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [validating, setValidating] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [actionLoadingKey, setActionLoadingKey] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [previewTypes, setPreviewTypes] = useState<PreviewProductType[]>([]);
  const [localProduct, setLocalProduct] =
    useState<ProductWithValidation>(values);

  const productRef = useMemo(() => {
    if (!idBusiness || !idComercio || !localProduct.id) return null;

    return doc(
      db_client,
      `/empresas/${String(idBusiness)}/comercios/${String(
        idComercio
      )}/productos/${localProduct.id}`
    );
  }, [idBusiness, idComercio, localProduct.id]);

  const statusBadge = getStatusBadge(localProduct);
  const validated = isProductValidated(localProduct);
  const visibleInVeryGo = isProductVisibleInVeryGo(localProduct);

  const hasLegacyTypoField =
    localProduct.verfied === true && localProduct.verified !== true;

  const activeTypesCount = getActiveTypes(localProduct).length;
  const totalTypesCount = Array.isArray(localProduct.tipos)
    ? localProduct.tipos.length
    : 0;

  const refreshPreviewTypes = async (product: ProductWithValidation) => {
    const types = await buildPreviewTypes(product);
    setPreviewTypes(types);
  };

  const handleValidateProduct = async () => {
    if (!productRef) {
      toast.error("No se pudo obtener la referencia del producto.");
      return;
    }

    const result = await fireSwalAboveModal({
      icon: "question",
      title: "¿Validar producto?",
      text: `El producto "${localProduct.name}" quedará aprobado para VeryGo si está disponible.`,
      showCancelButton: true,
      confirmButtonText: "Validar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#4f46e5",
    });

    if (!result.isConfirmed) return;

    try {
      setValidating(true);

     await updateDoc(productRef, {
  verified: true,
  verfied: true,
  validationStatus: "APPROVED",
  verificationSort: 1,
  rejectedReason: null,
  validatedAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  validationSource: "RANGERS_DASHBOARD",
});

     const nextProduct: ProductWithValidation = {
  ...localProduct,
  verified: true,
  verfied: true,
  validationStatus: "APPROVED",
  verificationSort: 1,
  rejectedReason: undefined,
  validationSource: "RANGERS_DASHBOARD",
};

      setLocalProduct(nextProduct);
      await refreshPreviewTypes(nextProduct);

      toast.success("Producto validado correctamente.");
    } catch (error) {
      console.error("VALIDATE_PRODUCT_ERROR:", error);
      toast.error("No se pudo validar el producto.");
    } finally {
      setValidating(false);
    }
  };

  const handleRejectProduct = async () => {
    if (!productRef || !idComercio) {
      toast.error("No se pudo obtener la referencia del producto.");
      return;
    }

    const result = await fireSwalAboveModal({
      icon: "warning",
      title: "¿Anular producto?",
      input: "textarea",
      inputLabel: "Motivo de anulación",
      inputPlaceholder:
        "Ejemplo: imagen incorrecta, precio incompleto, producto duplicado...",
      inputValidator: (value) => {
        if (!value || value.trim().length < 5) {
          return "Ingresa un motivo válido.";
        }

        return null;
      },
      showCancelButton: true,
      confirmButtonText: "Anular producto",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    const reason = String(result.value || "").trim();

    try {
      setRejecting(true);

      await updateDoc(productRef, {
  status: false,
  availability: "INACTIVO",
  verified: false,
  verfied: false,
  validationStatus: "REJECTED",
  verificationSort: 2,
  rejectedReason: reason,
  rejectedAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  validationSource: "RANGERS_DASHBOARD",
});

      const promotionsSnap = await getDocs(
        query(
          collection(db_client, "promociones"),
          where("idShop", "==", String(idComercio)),
          where("idProduct", "==", localProduct.id)
        )
      );

      await Promise.all(
        promotionsSnap.docs.map((promotionDoc) =>
          updateDoc(doc(db_client, `promociones/${promotionDoc.id}`), {
            status: false,
            estado: "PRODUCTO_ANULADO",
            productStatus: false,
            productAvailability: "INACTIVO",
            productDeleted: true,
            updatedAt: serverTimestamp(),
          })
        )
      );

     const nextProduct: ProductWithValidation = {
  ...localProduct,
  status: false,
  availability: "INACTIVO",
  verified: false,
  verfied: false,
  validationStatus: "REJECTED",
  verificationSort: 2,
  rejectedReason: reason,
  validationSource: "RANGERS_DASHBOARD",
};

      setLocalProduct(nextProduct);
      await refreshPreviewTypes(nextProduct);

      toast.success("Producto anulado correctamente.");
    } catch (error) {
      console.error("REJECT_PRODUCT_ERROR:", error);
      toast.error("No se pudo anular el producto.");
    } finally {
      setRejecting(false);
    }
  };


  const handleDisableToppingGroup = async (
  typeId: string,
  group: PreviewToppingGroup
) => {
  if (!productRef) {
    toast.error("No se pudo obtener la referencia del producto.");
    return;
  }

  const result = await fireSwalAboveModal({
    icon: "warning",
    title: "¿Desasociar grupo de adicionales?",
    text: `El grupo "${group.name}" dejará de mostrarse solo en esta variedad del producto.`,
    showCancelButton: true,
    confirmButtonText: "Desasociar grupo",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc2626",
  });

  if (!result.isConfirmed) return;

  try {
    setActionLoadingKey(`group-${group.id}`);

    const nextTypes = ((localProduct.tipos || []) as ProductTypeWithRefs[]).map(
      (type) => {
        if (String(type.id) !== String(typeId)) return type;

        const currentAdicionales = Array.isArray(type.adicionales)
          ? type.adicionales
          : [];

        return {
          ...type,
          adicionales: currentAdicionales.filter((adicional) => {
            const adicionalReferenceId = adicional.reference?.id || "";
            const adicionalId = adicional.id || "";

            return (
              String(adicionalReferenceId) !== String(group.id) &&
              String(adicionalId) !== String(group.id)
            );
          }),
        };
      }
    );

    await updateDoc(productRef, {
      tipos: nextTypes,
      updatedAt: serverTimestamp(),
      validationSource: "RANGERS_DASHBOARD",
    });

    const nextProduct: ProductWithValidation = {
      ...localProduct,
      tipos: nextTypes as any,
    };

    setLocalProduct(nextProduct);
    await refreshPreviewTypes(nextProduct);

    toast.success("Grupo desasociado correctamente de esta variedad.");
  } catch (error) {
    console.error("UNLINK_TOPPING_GROUP_ERROR:", error);
    toast.error("No se pudo desasociar el grupo.");
  } finally {
    setActionLoadingKey("");
  }
};

  const handleDisableToppingItem = async (
    group: PreviewToppingGroup,
    item: PreviewToppingItem
  ) => {
    const result = await fireSwalAboveModal({
      icon: "warning",
      title: "¿Anular adicional?",
      text: `El adicional "${item.name}" dejará de mostrarse en VeryGo.`,
      showCancelButton: true,
      confirmButtonText: "Anular adicional",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      setActionLoadingKey(`item-${group.id}-${item.id}`);

      const snap = await getDoc(group.reference);

      if (!snap.exists()) {
        toast.error("No se encontró el grupo de adicionales.");
        return;
      }

      const data = snap.data() as any;
      const currentItems = Array.isArray(data.items) ? data.items : [];

      const nextItems = currentItems.map((currentItem: any) => {
        if (String(currentItem.id) !== String(item.id)) return currentItem;

        return {
          ...currentItem,
          status: false,
          rejectedAt: new Date().toISOString(),
          validationSource: "RANGERS_DASHBOARD",
        };
      });

      await updateDoc(group.reference, {
        items: nextItems,
        updatedAt: serverTimestamp(),
      });

      await refreshPreviewTypes(localProduct);

      toast.success("Adicional anulado correctamente.");
    } catch (error) {
      console.error("DISABLE_TOPPING_ITEM_ERROR:", error);
      toast.error("No se pudo anular el adicional.");
    } finally {
      setActionLoadingKey("");
    }
  };

  const handleOpenPreview = async () => {
    try {
      setLoadingPreview(true);

      const types = await buildPreviewTypes(localProduct);

      setPreviewTypes(types);
      setShowDetails(true);
    } catch (error) {
      console.error("BUILD_PRODUCT_PREVIEW_ERROR:", error);
      toast.error("No se pudo cargar la vista previa del producto.");
    } finally {
      setLoadingPreview(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadCategory = async () => {
      if (!idBusiness || !idComercio || !localProduct.categoria) {
        setLoadingCategory(false);
        return;
      }

      try {
        setLoadingCategory(true);

        const categoryRef = doc(
          db_client,
          `/empresas/${String(idBusiness)}/comercios/${String(
            idComercio
          )}/categorias/${localProduct.categoria}`
        );

        const categorySnap = await getDoc(categoryRef);

        if (!active) return;

        if (categorySnap.exists()) {
          const { name } = categorySnap.data() as Category;
          setNameCategoria(name || "");
        } else {
          setNameCategoria("Sin categoría");
        }
      } catch (error) {
        console.error("GET_PRODUCT_CATEGORY_ERROR:", error);

        if (active) {
          setNameCategoria("Sin categoría");
        }
      } finally {
        if (active) {
          setLoadingCategory(false);
        }
      }
    };

    loadCategory();

    return () => {
      active = false;
    };
  }, [idBusiness, idComercio, localProduct.categoria]);

  return (
    <>
      <tr className="align-middle transition hover:bg-slate-50">
        <td className="min-w-[360px] px-4 py-4">
          <div className="flex items-center gap-4">
            {localProduct.img ? (
              <img
                src={localProduct.img}
                width={72}
                height={72}
                alt={localProduct.name || "Producto"}
                className="h-[72px] w-[72px] shrink-0 rounded-2xl object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xs font-black text-slate-500">
                Sin foto
              </div>
            )}

            <div className="min-w-0">
              <h3 className="line-clamp-1 text-base font-black text-slate-900">
                {localProduct.name || "Producto sin nombre"}
              </h3>

              <p className="mt-1 line-clamp-2 max-w-[440px] text-sm font-medium leading-5 text-slate-500">
                {localProduct.descripcion || "Sin descripción"}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">
                  ID: {localProduct.id}
                </span>

                {hasLegacyTypoField && (
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                    Corregir verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </td>

        <td className="min-w-[150px] px-4 py-4">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {loadingCategory ? "Cargando..." : nameCategoria || "Sin categoría"}
          </span>
        </td>

        <td className="min-w-[240px] px-4 py-4">
          <div className="flex max-w-[320px] flex-wrap gap-2">
            {Array.isArray(localProduct.tipos) &&
            localProduct.tipos.length > 0 ? (
              (localProduct.tipos as ProductTypeWithRefs[]).map(
                (tipo, index) => (
                  <span
                    key={tipo.id || index}
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${
                      tipo.status === false
                        ? "border-red-200 bg-red-50 text-red-600 line-through"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    {tipo.name ? `${tipo.name}: ` : "Precio único: "}
                    {tipo.price ? formatCurrency(tipo.price) : "Sin precio"}
                  </span>
                )
              )
            ) : (
              <span className="text-sm font-semibold text-slate-500">
                Sin variedades
              </span>
            )}
          </div>

          <p className="mt-2 text-[11px] font-bold text-slate-400">
            {activeTypesCount} activo(s) de {totalTypesCount}
          </p>
        </td>

        <td className="min-w-[160px] px-4 py-4">
          <div className="flex flex-col gap-2">
            <span
              className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-black ${statusBadge.className}`}
            >
              {statusBadge.label}
            </span>

            {visibleInVeryGo ? (
              <span className="text-xs font-bold text-emerald-600">
                Visible en VeryGo
              </span>
            ) : (
              <span className="text-xs font-bold text-slate-500">
                No visible en VeryGo
              </span>
            )}
          </div>
        </td>

        <td className="min-w-[140px] px-4 py-4">
          {validated ? (
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              Validado
            </span>
          ) : (
            <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
              Pendiente
            </span>
          )}
        </td>

        <td className="min-w-[260px] px-4 py-4">
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
              onClick={handleOpenPreview}
              disabled={loadingPreview}
            >
              {loadingPreview ? "Cargando..." : "Vista previa"}
            </button>

            {!validated && (
              <button
                type="button"
                className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
                onClick={handleValidateProduct}
                disabled={validating}
              >
                {validating ? "Validando..." : "Validar"}
              </button>
            )}

            <button
              type="button"
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-black text-red-600 shadow-sm transition hover:bg-red-100 disabled:opacity-60"
              onClick={handleRejectProduct}
              disabled={rejecting}
            >
              {rejecting ? "Anulando..." : "Anular"}
            </button>
          </div>
        </td>
      </tr>

      {showDetails && (
        <ProductDetailsModal
          product={localProduct}
          categoryName={nameCategoria}
          previewTypes={previewTypes}
          onClose={() => setShowDetails(false)}
          onValidate={handleValidateProduct}
          onRejectProduct={handleRejectProduct}
          onDisableToppingGroup={handleDisableToppingGroup}
          onDisableToppingItem={handleDisableToppingItem}
          validating={validating}
          rejecting={rejecting}
          actionLoadingKey={actionLoadingKey}
          validated={validated}
        />
      )}
    </>
  );
};