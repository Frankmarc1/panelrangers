import { IoMdAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { SubmitHandler, useForm } from "react-hook-form";

import { Dashboard } from "../../layout/Dashboard/Dashboard";
import { FloatingInput } from "../../components/Inputs/FloatingInput";
import { db_client, storage_client } from "../../firebase/client";

import styles from "../../../styles/index.module.css";

type Inputs = {
  name_category: string;
  slug: string;
  priority: number;
  status: boolean;
  showInHome: boolean;
  img_category?: FileList;
};

type SectorOption = {
  id: string;
  name: string;
};

type ImageToDelete = {
  url?: string;
  path?: string;
};

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function deleteStorageImage(image?: ImageToDelete | null) {
  if (!image?.path && !image?.url) return;

  try {
    const imageRef = image.path
      ? ref(storage_client, image.path)
      : ref(storage_client, image.url || "");

    await deleteObject(imageRef);
  } catch (error: any) {
    if (error?.code === "storage/object-not-found") return;

    console.error("CATEGORY_IMAGE_DELETE_ERROR:", error);
  }
}

export const FormMainCategorys = (): JSX.Element => {
  const router = useRouter();

  const idCategory = useMemo(() => {
    return typeof router.query.idCategory === "string"
      ? router.query.idCategory
      : "";
  }, [router.query.idCategory]);

  const { register, handleSubmit, reset, setValue, watch } = useForm<Inputs>({
    defaultValues: {
      name_category: "",
      slug: "",
      priority: 10,
      status: true,
      showInHome: true,
    },
  });

  const nameCategory = watch("name_category");

  const [sectors, setSectors] = useState<SectorOption[]>([]);
  const [selectedSectorIds, setSelectedSectorIds] = useState<Set<string>>(
    () => new Set()
  );

  const [urlImg, setUrlImg] = useState<string | null>(null);
  const [currentImg, setCurrentImg] = useState<string>("");
  const [currentImgPath, setCurrentImgPath] = useState<string>("");

  const [imageToDelete, setImageToDelete] = useState<ImageToDelete | null>(
    null
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [upload, setUpload] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const colRef: CollectionReference = collection(
    db_client,
    "sector_economicos"
  );

  useEffect(() => {
    const currentSlug = slugify(nameCategory || "");

    if (!idCategory && currentSlug) {
      setValue("slug", currentSlug);
    }
  }, [nameCategory, idCategory, setValue]);

  const toggleSector = (sectorId: string) => {
    setSelectedSectorIds((prev) => {
      const next = new Set(prev);

      if (next.has(sectorId)) {
        next.delete(sectorId);
      } else {
        next.add(sectorId);
      }

      return next;
    });
  };

  const handleRemoveImage = () => {
    if (currentImg || currentImgPath) {
      setImageToDelete({
        url: currentImg,
        path: currentImgPath,
      });
    }

    setUrlImg(null);
    setCurrentImg("");
    setCurrentImgPath("");
    setValue("img_category", undefined);
  };

  const handleDeleteCategory = async () => {
    if (!idCategory) return;

    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar esta categoría? Esta acción eliminará la categoría y su imagen del Storage. No se puede deshacer."
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);

      const categoryRef = doc(db_client, `main_categories/${idCategory}`);

      await deleteStorageImage({
        url: currentImg,
        path: currentImgPath,
      });

      await deleteDoc(categoryRef);

      toast.success("Categoría eliminada correctamente.");

      router.push("/categorias_principales");
    } catch (error) {
      console.error("MAIN_CATEGORY_DELETE_ERROR:", error);
      toast.error("No se pudo eliminar la categoría.");
    } finally {
      setDeleting(false);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const cleanName = String(data.name_category || "").trim();
    const cleanSlug = slugify(data.slug || cleanName);
    const priority = Number(data.priority || 0);

    if (!cleanName) {
      toast.error("Ingrese nombre por favor.");
      document.getElementById("nombre")?.focus();
      return;
    }

    if (cleanName.length < 3 || /[0-9]/.test(cleanName)) {
      toast.error("Categoría no válida.");
      document.getElementById("nombre")?.focus();
      return;
    }

    if (!cleanSlug) {
      toast.error("Ingrese un slug válido.");
      return;
    }

    if (!Number.isFinite(priority) || priority <= 0) {
      toast.error("Ingrese una prioridad válida. Ejemplo: 10, 20, 30.");
      document.getElementById("priority")?.focus();
      return;
    }

    if (selectedSectorIds.size === 0) {
      toast.error("Seleccione al menos un sector económico.");
      return;
    }

    try {
      setUpload(true);

      const docRef = idCategory
        ? doc(db_client, `main_categories/${idCategory}`)
        : doc(collection(db_client, "main_categories"));

      let img = currentImg;
      let imgPath = currentImgPath;

      const selectedFile = data.img_category?.[0];

      if (selectedFile) {
        const safeFileName = selectedFile.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9_.-]/g, "-");

        const newImgPath = `main_categories/${docRef.id}/${Date.now()}-${safeFileName}`;
        const imgRef = ref(storage_client, newImgPath);

        await uploadBytes(imgRef, selectedFile);

        img = await getDownloadURL(imgRef);
        imgPath = newImgPath;
      }

      if (!img) {
        toast.error("Agregue una imagen para la categoría.");
        setUpload(false);
        return;
      }

      const sectoresEconomicos: DocumentReference[] = Array.from(
        selectedSectorIds
      ).map((sectorId) => doc(db_client, `sector_economicos/${sectorId}`));

      const obj = {
        id: docRef.id,
        name: cleanName,
        slug: cleanSlug,
        img,
        imgPath,
        priority,
        status: Boolean(data.status),
        showInHome: Boolean(data.showInHome),
        sectoresEconomicos,
        updatedAt: serverTimestamp(),
        ...(!idCategory ? { createdAt: serverTimestamp() } : {}),
      };

      if (idCategory) {
        await updateDoc(docRef, obj);
        toast.success("Categoría actualizada con éxito.");
      } else {
        await setDoc(docRef, obj);
        toast.success("Categoría creada con éxito.");
      }

      await deleteStorageImage(imageToDelete);

      setImageToDelete(null);

      if (!idCategory) {
        setUrlImg(null);
        setCurrentImg("");
        setCurrentImgPath("");
        setSelectedSectorIds(new Set());

        reset({
          name_category: "",
          slug: "",
          priority: 10,
          status: true,
          showInHome: true,
        });
      } else {
        setCurrentImg(img);
        setCurrentImgPath(imgPath);
        setUrlImg(img);
      }
    } catch (error) {
      console.error("MAIN_CATEGORY_SAVE_ERROR:", error);
      toast.error("No se pudo guardar la categoría.");
    } finally {
      setUpload(false);
    }
  };

  const renderImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setUrlImg(previewUrl);
  };

  useEffect(() => {
    getDocs(colRef)
      .then((snap) => {
        const data = snap.docs.map((docSnap) => {
          const sectorData = docSnap.data() as DocumentData;

          return {
            id: docSnap.id,
            name: String(sectorData.name || "Sin nombre"),
          };
        });

        setSectors(data);
      })
      .catch((error) => {
        console.error("SECTORS_LOAD_ERROR:", error);
        setSectors([]);
        toast.error("No se pudieron cargar los sectores económicos.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!idCategory) return;

    getDoc(doc(db_client, `main_categories/${idCategory}`)).then((snap) => {
      if (!snap.exists()) return;

      const {
        img = "",
        imgPath = "",
        name = "",
        slug = "",
        priority = 10,
        status = true,
        showInHome = true,
        sectoresEconomicos = [],
      } = snap.data();

      setValue("name_category", name);
      setValue("slug", slug || slugify(name));
      setValue("priority", Number(priority || 10));
      setValue("status", Boolean(status));
      setValue("showInHome", Boolean(showInHome));

      setCurrentImg(img);
      setCurrentImgPath(imgPath);
      setUrlImg(img);

      const sectorIds = new Set<string>();

      sectoresEconomicos.forEach((se: DocumentReference) => {
        if (se?.id) {
          sectorIds.add(se.id);
        }
      });

      setSelectedSectorIds(sectorIds);
    });
  }, [idCategory, setValue]);

  return (
    <Dashboard>
      <div className="card border border-slate-300 bg-slate-50 rounded mt-[-1rem]">
        <div className="card-header flex justify-center border-b py-2">
          <h3 className="card-title font-medium">
            {!idCategory ? "Agregar Categoría" : "Actualizar Categoría"}
          </h3>
        </div>

        <div
          className={`card-body overflow-auto max-h-[36rem] ${styles.scroll}`}
        >
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            {urlImg ? (
              <div className="flex justify-center items-center mb-4">
                <div className="w-full max-w-[420px] bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
                  <img
                    src={urlImg}
                    alt="Vista previa de categoría"
                    className="w-full h-[220px] object-contain rounded bg-slate-100"
                  />
                </div>

                <div className="flex self-center ml-4">
                  <button
                    type="button"
                    className="btn btn-error ms-2 text-xl text-white"
                    onClick={handleRemoveImage}
                    disabled={upload || deleting}
                    title="Quitar imagen"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full mb-4">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col justify-center items-center w-full h-[4rem] bg-white rounded-lg border border-gray-400 cursor-pointer dark:hover:bg-bray-100 dark:bg-gray-100 hover:bg-gray-100 dark:border-gray-200 dark:hover:border-gray-50 dark:hover:bg-gray-300"
                >
                  <div className="flex justify-center items-center pt-5 pb-6 font-medium">
                    <p className="font-semibold mt-1 mr-2 text-xl">
                      <IoMdAddCircle />
                    </p>
                    Agregar Imagen
                  </div>

                  <input
                    id="dropzone-file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...register("img_category", {
                      onChange: renderImage,
                    })}
                  />
                </label>
              </div>
            )}

            <div className="mb-5">
              <FloatingInput
                type="text"
                id="nombre"
                placeholder="Nombre"
                {...register("name_category")}
              />
            </div>

            <div className="mb-5">
              <FloatingInput
                type="text"
                id="slug"
                placeholder="Slug. Ejemplo: fast-food"
                {...register("slug")}
              />
            </div>

            <div className="mb-5">
              <FloatingInput
                type="number"
                id="priority"
                placeholder="Prioridad. Ejemplo: 10"
                {...register("priority", {
                  valueAsNumber: true,
                })}
              />

              <p className="text-xs text-slate-500 mt-1">
                Menor número = aparece primero. Usa 10, 20, 30 para poder
                insertar categorías después.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
              <label className="label cursor-pointer bg-white border rounded px-3">
                <span className="font-medium">Categoría activa</span>

                <input
                  type="checkbox"
                  className="checkbox border border-slate-500"
                  {...register("status")}
                />
              </label>

              <label className="label cursor-pointer bg-white border rounded px-3">
                <span className="font-medium">Mostrar en Home</span>

                <input
                  type="checkbox"
                  className="checkbox border border-slate-500"
                  {...register("showInHome")}
                />
              </label>
            </div>

            <div className="form-control">
              <p className="font-semibold mb-2">Sectores económicos</p>

              <ul className={`${styles.gridCol2}`}>
                {loading ? (
                  <p className="flex justify-center">Cargando ...</p>
                ) : (
                  sectors.map((sector) => (
                    <li key={sector.id}>
                      <label className="label cursor-pointer">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="checkbox border border-slate-500 mr-1 form-check-input"
                            value={sector.id}
                            id={sector.id}
                            checked={selectedSectorIds.has(sector.id)}
                            onChange={() => toggleSector(sector.id)}
                          />
                        </div>

                        <p className="font-medium">{sector.name}</p>
                      </label>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <button
              type="submit"
              disabled={upload || deleting}
              className="w-full mt-3 ml-1 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-slate-500 hover:shadow-lg focus:bg-blue-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mr-3"
            >
              <p className="font-medium text-[1rem]">
                {!idCategory
                  ? upload
                    ? "Guardando..."
                    : "Guardar"
                  : upload
                    ? "Actualizando..."
                    : "Actualizar"}
              </p>
            </button>

            {idCategory && (
              <button
                type="button"
                disabled={upload || deleting}
                onClick={handleDeleteCategory}
                className="w-full mt-3 ml-1 inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-400 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out mr-3"
              >
                <p className="font-medium text-[1rem]">
                  {deleting ? "Eliminando..." : "Eliminar categoría"}
                </p>
              </button>
            )}
          </form>
        </div>
      </div>
    </Dashboard>
  );
};