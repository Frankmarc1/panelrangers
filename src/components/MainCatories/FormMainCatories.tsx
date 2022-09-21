import { IoMdAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, CollectionReference, doc, DocumentData, DocumentReference, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { SubmitHandler, useForm } from 'react-hook-form';
import { Dashboard } from "../../layout/Dashboard/Dashboard"
import { FloatingInput } from "../Inputs/FloatingInput";
import { db_client } from "../../firebase/client";
import { storage_client } from "../../firebase/client";
import styles from '../../../styles/index.module.css';

type Inputs = {
    name_category: String;
    img_category: FileList;
}
export const FormMainCategorys = (): JSX.Element => {
    const router = useRouter();
    const { idCategory } = router.query;

    const { register, handleSubmit, reset, setValue } = useForm<Inputs>();
    const [sector, setSector] = useState<DocumentData[]>([]);
    const [urlImg, setUrlImg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [upload, setUpload] = useState<boolean>(false);
    const colRef: CollectionReference = collection(db_client, 'sector_economicos');
    //event Submit
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const docRef = idCategory
            ? doc(db_client, `main_categories/${idCategory}`)
            : doc(collection(db_client, 'main_categories'))
        const imgRef = ref(
            storage_client,
            `main_categories/${docRef.id}/${Date.now()}`
        )
        let img: string = '';
        if (!data.name_category) {
            toast.error("Ingrese Nombre Porfavor.")
            document.getElementById('nombre')?.focus();
            return;
        }
        if (data.name_category.trim().length < 3 || data.name_category.match(/[0-9]/)) {
            toast.error("Categoria No Valida.")
            document.getElementById('nombre')?.focus();
            return;
        }
        /*if(!idCategory){
            document
            .querySelectorAll<HTMLInputElement>('.sector')
            .forEach((element) => {
                if (element.checked===false) {
                    toast.error("selleiona")
                    return;
                }
            });
        }*/

        setUpload(true);

        if (data.img_category instanceof FileList) {
            await uploadBytes(imgRef, data.img_category[0]);
            img = await getDownloadURL(imgRef);
        } else {
            img = data.img_category;
        }

        const se: DocumentReference[] = [];

        document
            .querySelectorAll<HTMLInputElement>('.sector')
            .forEach((element) => {
                if (element.checked) {
                    se.push(doc(db_client, `sector_economicos/${element.value}`));

                }
            });

        const obj = {
            id: docRef.id,
            name: data.name_category,
            img,
            status: true,
            sectoresEconomicos: se,
        }
        console.log(obj)

        if (idCategory) {
            await updateDoc(docRef, obj)
            toast.success("Categoria Actualizada con exito")
        } else {
            await setDoc(docRef, obj)
            toast.success("Categoria Creada con exito")
        }
        if (!idCategory) {
            setUrlImg(null);
            reset();
        }

        setUpload(false);

    }

    const renderImage = (evt: any) => {
        const blob = evt.target.files[0];
        const urlImg = URL.createObjectURL(blob);
        setUrlImg(urlImg);
    };

    useEffect(() => {
        getDocs(colRef)
            .then((snap) => {
                if (!snap.empty) {
                    setSector(snap.docs.map((doc) => doc.data()));
                }

                setLoading(false);
            })
            .catch(() => {
                setSector([]);
            });
    }, []);

    useEffect(() => {
        if (idCategory) {
            getDoc(doc(db_client, `main_categories/${idCategory}`)).then((snap) => {
                if (snap.exists()) {
                    const { img, name, sectoresEconomicos = [] } = snap.data();

                    setValue('img_category', img);
                    setValue('name_category', name);
                    setUrlImg(img);

                    sectoresEconomicos.forEach((se: DocumentReference) => {
                        const box: HTMLInputElement | null =
                            document.querySelector(`.sector[value = ${se.id}]`);

                        if (box) {
                            box.checked = true;
                        }
                    });
                }
            });
        }
    }, [idCategory, setValue]);
    return (
        <Dashboard>
            <div className="card border border-slate-300 bg-slate-50 rounded mt-[-1rem]">
                <div className="card-header flex justify-center border-b py-2">
                    <h3 className="card-title font-medium">
                        {
                            (!idCategory)
                                ? 'Agregar Categoria'
                                : 'Actualizar Categoria'
                        }
                    </h3>
                </div>
                <div className={`card-body overflow-auto max-h-[36rem] ${styles.scroll} `}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        autoComplete='off'
                    >
                        {urlImg ? (
                            <div className='flex justify-content-center align-items-center mb-3 justify-center'>
                                <img
                                    src={urlImg}
                                    alt=''
                                    height={'320px'}
                                    width={'60%'}
                                />
                                <div className="flex self-center ml-4">
                                    <button
                                        className='btn btn-error ms-2 text-xl text-white  '
                                        onClick={() => setUrlImg(null)}
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center w-full mb-4">

                                <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-full h-[4rem] bg-white rounded-lg border border-gray-400  cursor-pointer dark:hover:bg-bray-100 dark:bg-gray-100 hover:bg-gray-100 dark:border-gray-200 dark:hover:border-gray-50 dark:hover:bg-gray-300">
                                    <div className="flex  justify-center items-center pt-5 pb-6 font-medium">
                                        <p className="font-semibold mt-1 mr-2 text-xl"><IoMdAddCircle /></p> Agregar Imagen
                                    </div>
                                    <input
                                        id="dropzone-file"
                                        type="file"
                                        className="hidden"
                                        {...register('img_category', {
                                            onChange: renderImage,
                                        })}
                                    />
                                </label>

                            </div>
                        )}

                        <div className='mb-5 '>
                            <FloatingInput
                                type='text'
                                id='nombre'
                                placeholder="Nombre"
                                {...register('name_category')}
                            />
                        </div>
                        <div className="form-control">

                            <ul className={`${styles.gridCol2}`}>
                                {(loading)
                                    ? <p className="flex justify-center">Cargando ...</p>
                                    :
                                    sector.map((x) => (
                                        <li key={x.id}>
                                            <label className="label cursor-pointer">
                                                <div className='form-check'>
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox border border-slate-500 mr-1 form-check-input sector"
                                                        value={x.id}
                                                        id={x.id}
                                                    />
                                                </div>
                                                <p className="font-medium">{x.name}</p>
                                            </label>

                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <button
                            type="submit"
                            disabled={upload}
                            className=" w-full mt-3 ml-1 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-slate-500 hover:shadow-lg focus:bg-blue-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mr-3">
                            {
                                (!idCategory)
                                    ?
                                    <p className="font-medium text-[1rem]">
                                        {
                                            (upload) ? 'Guardando...' : 'Guardar'
                                        }
                                    </p>
                                    : <p className="font-medium text-[1rem]">
                                        {
                                            (upload) ? 'Actualizando...' : 'Actualizar'
                                        }
                                    </p>
                            }

                        </button>
                    </form>
                </div>

            </div>
        </Dashboard>
    );
}

