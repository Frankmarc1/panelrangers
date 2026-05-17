import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import {
  FaCheck,
  FaPause,
  FaTimes,
  FaTrash,
  FaStar,
  FaExclamationTriangle,
} from "react-icons/fa";

import { db_client, storage_client } from "../../firebase/client";

type PromotionAdmin = {
  id: string;

  img?: string;
  imgPath?: string;

  productImage?: string;
  productName?: string;

  storeName?: string;
  comercioName?: string;

  promoPrice?: number;
  price?: number;
  regularPrice?: number;

  estado?: string;
  status?: boolean;

  verified?: boolean;
  validationStatus?: string;

  adminPriority?: number;
  priority?: number;
  featured?: boolean;

  politicas?: string;
  city?: string;

  idCompany?: string;
  idShop?: string;
  idProduct?: string;

  productStatus?: boolean;
  productAvailability?: string;
  productDeleted?: boolean;
  productVerified?: boolean;
  productValidationStatus?: string;
  productVisible?: boolean;
};

type ProductSnapshot = {
  productStatus: boolean;
  productAvailability: string;
  productVerified: boolean;
  productValidationStatus: string;
  productVisible: boolean;
  productDeleted: boolean;
};

function formatCurrency(value?: number): string {
  return `S/ ${Number(value || 0).toFixed(2)}`;
}

function getString(value: unknown): string {
  return String(value || "").trim();
}

function normalizeUpper(value: unknown): string {
  return getString(value).toUpperCase();
}

function getPromoImage(values: PromotionAdmin): string {
  return values.img || values.productImage || "";
}

function getPromoPrice(values: PromotionAdmin): number {
  return Number(values.promoPrice || values.price || 0);
}

function getPriority(values: PromotionAdmin): number {
  return Number(values.adminPriority || values.priority || 99);
}

function isProductSnapshotVisible(snapshot: ProductSnapshot): boolean {
  return (
    snapshot.productStatus === true &&
    snapshot.productAvailability === "DISPONIBLE" &&
    snapshot.productVerified === true &&
    snapshot.productValidationStatus === "APPROVED" &&
    snapshot.productVisible === true &&
    snapshot.productDeleted !== true
  );
}

function getPromotionProductReason(values: PromotionAdmin): string | null {
  const productAvailability = normalizeUpper(values.productAvailability);
  const productValidationStatus = normalizeUpper(values.productValidationStatus);

  if (values.productDeleted === true) {
    return "Producto eliminado";
  }

  if (values.productStatus === false) {
    return "Producto inactivo";
  }

  if (productAvailability && productAvailability !== "DISPONIBLE") {
    return `Producto ${productAvailability.toLowerCase()}`;
  }

  if (values.productVerified === false) {
    return "Producto no aprobado";
  }

  if (productValidationStatus && productValidationStatus !== "APPROVED") {
    return `Producto en ${productValidationStatus}`;
  }

  if (values.productVisible === false) {
    return "No visible en VeryGo";
  }

  return null;
}

async function deletePromotionImage(values: PromotionAdmin) {
  if (!values.id && !values.imgPath) return;

  try {
    const imageRef = values.imgPath
      ? ref(storage_client, values.imgPath)
      : ref(storage_client, `promociones/${values.id}`);

    await deleteObject(imageRef);
  } catch (error: any) {
    if (error?.code === "storage/object-not-found") return;

    console.error("PROMOTION_IMAGE_DELETE_ERROR:", error);
  }
}

async function getProductSnapshotFromPromotion(
  values: PromotionAdmin
): Promise<ProductSnapshot> {
  const idCompany = getString(values.idCompany);
  const idShop = getString(values.idShop);
  const idProduct = getString(values.idProduct);

  if (!idCompany || !idShop || !idProduct) {
    throw new Error(
      "La promoción no tiene idCompany, idShop o idProduct para validar el producto."
    );
  }

  const productRef = doc(
    db_client,
    `empresas/${idCompany}/comercios/${idShop}/productos/${idProduct}`
  );

  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) {
    return {
      productStatus: false,
      productAvailability: "ELIMINADO",
      productVerified: false,
      productValidationStatus: "DELETED",
      productVisible: false,
      productDeleted: true,
    };
  }

  const product = productSnap.data() as {
    status?: boolean;
    availability?: string;
    verified?: boolean;
    validationStatus?: string;
    estado?: string;
  };

  const productAvailability = normalizeUpper(
    product.availability || "INACTIVO"
  );

  const productValidationStatus = normalizeUpper(product.validationStatus);
  const productEstado = normalizeUpper(product.estado);

  const productStatus = product.status === true;
  const productVerified = product.verified === true;
  const productDeleted = productEstado === "ELIMINADO";

  const productVisible =
    productStatus &&
    productAvailability === "DISPONIBLE" &&
    productVerified &&
    productValidationStatus === "APPROVED" &&
    !productDeleted;

  return {
    productStatus,
    productAvailability,
    productVerified,
    productValidationStatus,
    productVisible,
    productDeleted,
  };
}

export const RowPromotionAdmin = ({
  values,
}: {
  values: PromotionAdmin;
}) => {
  const [loading, setLoading] = useState(false);

  if (!values?.id) {
    return (
      <tr>
        <td colSpan={7}>
          <div className="rounded bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
            Promoción sin ID válido.
          </div>
        </td>
      </tr>
    );
  }

  const promotionRef = doc(db_client, "promociones", values.id);

 const approvePromotion = async () => {
  try {
    setLoading(true);

    const productSnapshot = await getProductSnapshotFromPromotion(values);

    if (!isProductSnapshotVisible(productSnapshot)) {
      await updateDoc(promotionRef, {
        status: false,
        estado: "PRODUCTO_NO_VALIDO",

        verified: false,
        validationStatus: "PRODUCTO_NO_VALIDO",

        ...productSnapshot,

        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.error(
        "No se puede aprobar. El producto asociado aún no está validado, disponible o visible."
      );

      return;
    }

    await updateDoc(promotionRef, {
      status: true,
      estado: "ACTIVO",

      verified: true,
      validationStatus: "APPROVED",

      ...productSnapshot,

      reviewedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    toast.success("Promoción aprobada y producto revalidado.");
  } catch (error: any) {
    console.error("PROMOTION_APPROVE_ERROR:", error);

    toast.error(error?.message || "No se pudo aprobar la promoción.");
  } finally {
    setLoading(false);
  }
};

  const rejectPromotion = async () => {
  const confirmReject = window.confirm(
    "¿Seguro que deseas rechazar esta promoción?"
  );

  if (!confirmReject) return;

  try {
    setLoading(true);

    await updateDoc(promotionRef, {
      status: false,
      estado: "RECHAZADO",

      verified: false,
      validationStatus: "REJECTED",

      reviewedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    toast.success("Promoción rechazada.");
  } catch (error) {
    console.error("PROMOTION_REJECT_ERROR:", error);
    toast.error("No se pudo rechazar la promoción.");
  } finally {
    setLoading(false);
  }
};

const pausePromotion = async () => {
  try {
    setLoading(true);

    await updateDoc(promotionRef, {
      status: false,
      estado: "PAUSADO",

      validationStatus: "APPROVED",
      verified: true,

      updatedAt: serverTimestamp(),
    });

    toast.success("Promoción pausada.");
  } catch (error) {
    console.error("PROMOTION_PAUSE_ERROR:", error);
    toast.error("No se pudo pausar la promoción.");
  } finally {
    setLoading(false);
  }
};

  const toggleFeatured = async () => {
    try {
      setLoading(true);

      await updateDoc(promotionRef, {
        featured: !values.featured,
        updatedAt: serverTimestamp(),
      });

      toast.success(
        values.featured
          ? "Promoción quitada de destacadas."
          : "Promoción marcada como destacada."
      );
    } catch (error) {
      console.error("PROMOTION_FEATURED_ERROR:", error);
      toast.error("No se pudo actualizar destacada.");
    } finally {
      setLoading(false);
    }
  };

  const updatePriority = async () => {
    const currentPriority = getPriority(values);

    const input = window.prompt(
      "Ingresa la prioridad. Menor número aparece primero.",
      String(currentPriority)
    );

    if (!input) return;

    const newPriority = Number(input);

    if (!Number.isFinite(newPriority) || newPriority <= 0) {
      toast.error("Prioridad inválida. Usa números como 10, 20, 30.");
      return;
    }

    try {
      setLoading(true);

      await updateDoc(promotionRef, {
        adminPriority: newPriority,
        updatedAt: serverTimestamp(),
      });

      toast.success("Prioridad actualizada.");
    } catch (error) {
      console.error("PROMOTION_PRIORITY_ERROR:", error);
      toast.error("No se pudo actualizar la prioridad.");
    } finally {
      setLoading(false);
    }
  };

  const deletePromotion = async () => {
  const confirmDelete = window.confirm(
    "¿Seguro que deseas eliminar esta promoción? Se ocultará de VeryGo, pero quedará guardada como historial."
  );

  if (!confirmDelete) return;

  try {
    setLoading(true);

    await updateDoc(promotionRef, {
      status: false,
      estado: "ELIMINADO",
      featured: false,

      verified: false,
      validationStatus: "DELETED",

      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    toast.success("Promoción eliminada de VeryGo.");
  } catch (error: any) {
    console.error("PROMOTION_SOFT_DELETE_ERROR:", error);

    if (error?.code === "permission-denied") {
      toast.error("No tienes permisos para eliminar esta promoción.");
      return;
    }

    toast.error("No se pudo eliminar la promoción.");
  } finally {
    setLoading(false);
  }
};

  const hardDeletePromotion = async () => {
    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar definitivamente esta promoción?\n\nEsta acción borrará el documento y también intentará borrar la imagen del Storage.\n\nID: ${values.id}`
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      await deletePromotionImage(values);
      await deleteDoc(promotionRef);

      toast.success("Promoción eliminada definitivamente.");
    } catch (error: any) {
      console.error("PROMOTION_HARD_DELETE_ERROR:", error);

      if (error?.code === "permission-denied") {
        toast.error("No tienes permisos para eliminar definitivamente.");
        return;
      }

      toast.error("No se pudo eliminar definitivamente la promoción.");
    } finally {
      setLoading(false);
    }
  };

  const revalidateProductSnapshot = async () => {
    try {
      setLoading(true);

      const productSnapshot = await getProductSnapshotFromPromotion(values);

      await updateDoc(promotionRef, {
        ...productSnapshot,
        updatedAt: serverTimestamp(),
      });

      toast.success(
        productSnapshot.productVisible
          ? "Producto revalidado. La promoción ya puede aprobarse."
          : "Producto revalidado, pero todavía no está listo para mostrarse."
      );
    } catch (error: any) {
      console.error("PROMOTION_REVALIDATE_PRODUCT_ERROR:", error);

      toast.error(
        error?.message || "No se pudo revalidar el producto asociado."
      );
    } finally {
      setLoading(false);
    }
  };

  const image = getPromoImage(values);
  const price = getPromoPrice(values);
  const priority = getPriority(values);
  const productBlockReason = getPromotionProductReason(values);

  return (
    <tr>
      <td>
        {image ? (
          <img
            src={image}
            alt={values.productName || "Promoción"}
            className="h-[60px] w-[90px] rounded border border-slate-200 bg-slate-100 object-cover"
          />
        ) : (
          <div className="flex h-[60px] w-[90px] items-center justify-center rounded border border-slate-200 bg-slate-100 text-xs text-slate-400">
            Sin imagen
          </div>
        )}
      </td>

      <td>
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">
            {values.productName || "Producto sin nombre"}
          </span>

          {values.politicas && (
            <span className="max-w-[260px] truncate text-xs text-slate-500">
              {values.politicas}
            </span>
          )}

          {productBlockReason && (
            <span className="mt-1 inline-flex w-fit items-center gap-1 rounded bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-700">
              <FaExclamationTriangle />
              {productBlockReason}
            </span>
          )}
        </div>
      </td>

      <td>
        <div className="flex flex-col">
          <span className="font-medium">
            {values.storeName || values.comercioName || "Tienda"}
          </span>

          {values.city && (
            <span className="text-xs text-slate-400">{values.city}</span>
          )}
        </div>
      </td>

      <td>
        <span className="font-bold text-red-700">
          {formatCurrency(price)}
        </span>
      </td>

      <td>
        <div className="flex flex-col gap-1">
          {values.status ? (
            <span className="badge badge-success text-white">Visible</span>
          ) : (
            <span className="badge badge-error text-white">Oculta</span>
          )}

          <span className="badge badge-outline">
            {values.estado || "SIN ESTADO"}
          </span>

          {values.productVisible ? (
            <span className="badge badge-success text-white">
              Producto OK
            </span>
          ) : (
            <span className="badge badge-warning text-white">
              Producto no válido
            </span>
          )}
        </div>
      </td>

      <td>
        <button
          type="button"
          className="badge badge-outline cursor-pointer font-bold"
          disabled={loading}
          onClick={updatePriority}
          title="Editar prioridad"
        >
          {priority}
        </button>

        {values.featured && (
          <div className="mt-1">
            <span className="badge badge-warning text-white">Destacada</span>
          </div>
        )}
      </td>

      <td>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={loading || values.estado === "ACTIVO"}
            className="btn btn-xs btn-success text-white"
            onClick={approvePromotion}
            title="Aprobar"
          >
            <FaCheck />
          </button>

          <button
            type="button"
            disabled={loading}
            className="btn btn-xs btn-info text-white"
            onClick={revalidateProductSnapshot}
            title="Revalidar producto asociado"
          >
            Revisar producto
          </button>

          <button
            type="button"
            disabled={loading || values.estado === "PAUSADO"}
            className="btn btn-xs btn-warning text-white"
            onClick={pausePromotion}
            title="Pausar"
          >
            <FaPause />
          </button>

          <button
            type="button"
            disabled={loading || values.estado === "RECHAZADO"}
            className="btn btn-xs btn-error text-white"
            onClick={rejectPromotion}
            title="Rechazar"
          >
            <FaTimes />
          </button>

          <button
            type="button"
            disabled={loading}
            className={`btn btn-xs ${
              values.featured ? "btn-neutral" : "btn-info"
            } text-white`}
            onClick={toggleFeatured}
            title="Destacar"
          >
            <FaStar />
          </button>

          <button
            type="button"
            disabled={loading || values.estado === "ELIMINADO"}
            className="btn btn-xs btn-outline btn-error"
            onClick={deletePromotion}
            title="Eliminar de VeryGo"
          >
            <FaTrash />
          </button>

          {values.estado === "ELIMINADO" && (
            <button
              type="button"
              disabled={loading}
              className="btn btn-xs btn-error text-white"
              onClick={hardDeletePromotion}
              title="Eliminar definitivamente"
            >
              Borrar final
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};