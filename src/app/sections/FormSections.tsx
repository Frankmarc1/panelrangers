import { collection, collectionGroup, doc, DocumentData, DocumentReference, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db_client } from "../../firebase/client";
import { useState, useEffect, ChangeEventHandler, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form"

import styles from "../../../styles/index.module.css";
import { Spinner } from "../../components/spinner/Spinner";
import { FloatingInput } from "../../components/Inputs/FloatingInput";



type Inputs = {
    name_section: string;
    desc_section: string;
    priority_section: string;
    type_section: string;
};

interface Home {
    id: string;
    status: true;
    name: string;
    description: string;
    prioridad: number;
    sectoresEconomicos?: DocumentReference[];
    comerciosReference?: DocumentReference[];
}
const commerceReference = collectionGroup(db_client, 'comercios');
const seReference = collection(db_client, 'sector_economicos');
const checkedElement = (id: string) => {
    const element = document.querySelector<HTMLInputElement>(
        `.type[id="${id}"]`
    );
    if (element) element.checked=true;
};

const FormSections = () => {
    const { register, handleSubmit, setValue, reset } = useForm<Inputs>();
    const [type, setType] = useState<string>('2');
    const [data, setData] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [upload, setUpload] = useState<boolean>(false);

    const router = useRouter();
    const { idSection } = router.query


    const onChangeType: ChangeEventHandler<HTMLSelectElement> = (
        e: ChangeEvent<HTMLSelectElement>
    ) => {
        setType(e.target.value);
    };

    useEffect(() => {
        let q = null;

        if (type === '2') {
            q = commerceReference;
        }

        if (type === '1') {
            q = seReference;
        }

        if (q) {
            setLoading(true);

            getDocs(q)
                .then((snap) => {
                    setData(
                        snap.docs.map((doc) => {
                            return {
                                path: doc.ref.path,
                                ...doc.data(),
                            };
                        })
                    );
                    setLoading(false);
                })
                .catch(() => setData([]));
        }

        if (idSection) {
            getDoc(doc(db_client, `home/${idSection}`))
                .then((snap) => {
                    if (snap.exists()) {
                        const {
                            sectoresEconomicos = null,
                            comerciosReference = null,
                        } = snap.data();

                        if (sectoresEconomicos) {
                            sectoresEconomicos.map((se: DocumentReference) => {
                                checkedElement(se.id);
                            });
                        }

                        if (comerciosReference) {
                            comerciosReference.map(
                                (commerce: DocumentReference) => {
                                    checkedElement(commerce.id);
                                }
                            );
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }

    }, [type]);

    useEffect(() => {
        if (idSection) {
            getDoc(doc(db_client, `home/${idSection}`))
                .then((snap) => {
                    if (snap.exists()) {
                        const {
                            description,
                            name,
                            prioridad,
                            sectoresEconomicos = null,
                            comerciosReference = null,
                        } = snap.data();
                        const type =
                            (sectoresEconomicos && '1') ||
                            (comerciosReference && '2');

                        setValue('name_section', name);
                        setValue('desc_section', description);
                        setValue('priority_section', prioridad);
                        setValue('type_section', type);
                        setType(type);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

        }
    }, [idSection]);

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const docRef = idSection
            ? doc(db_client, `home/${idSection}`)
            : doc(collection(db_client, 'home'))

        const reference: DocumentReference[] = [];
        if (!data.name_section.trim()) {
            toast.error("ingrese Nombre Porfavor");
            document.getElementById('name_section')?.focus();
            return;
        }
        if (data.name_section.trim().length < 3 || data.name_section.match(/[0-9]/)) {
            toast.error("Nombre Invalido");
            document.getElementById('name_section')?.focus();
            return;
        }

        if (!data.desc_section.trim()) {
            toast.error("ingrese Descripcion Porfavor");
            document.getElementById('desc_section')?.focus();
            return;
        }
        if (data.desc_section.trim().length < 3 || data.desc_section.match(/[0-9]/)) {
            toast.error("Descripcion Invalida");
            document.getElementById('desc_section')?.focus();
            return;
        }
        if (!data.priority_section.trim()) {
            toast.error("ingrese Prioridad Porfavor");
            document.getElementById('priority_section')?.focus();
            return;
        }

        setUpload(true);

        document
            .querySelectorAll<HTMLInputElement>('.type')
            .forEach((element) => {
                if (element.checked) {
                    let el: DocumentReference = doc(db_client, element.value);

                    reference.push(el);
                }
            });

        let obj: Home = {
            id: docRef.id,
            status: true,
            description: data.desc_section.trim(),
            name: data.name_section.trim(),
            prioridad: parseFloat(data.priority_section),
        };

        if (type === '2') {
            obj.comerciosReference = reference;
        }

        if (type === '1') {
            obj.sectoresEconomicos = reference;
        }

        if (idSection) {
            await updateDoc(docRef, {
                ...obj,
            });

            toast.success('Sección actualizada con exito.');
        } else {
            await setDoc(docRef, obj);

            toast.success('Sección creada con exito.');
        }

        if (!idSection) {
            reset();
        }

        setUpload(false);


    }

    return (

        <div className="flex justify-center mt-[-1.5rem] mb-0">
            <div className="block rounded-lg shadow-lg bg-white w-full text-center">
                <div className="card-header border-b py-1">
                    <h3>Crear Seccion</h3>
                </div>
                <div className="card-body mt-[-1rem] ">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        autoComplete="off"
                    >
                        <FloatingInput
                            type={"text"}
                            placeholder="Nombre"
                            id="name_section"
                            {...register("name_section")}

                        />
                        <FloatingInput
                            type={"text"}
                            placeholder="Descripcion"
                            id="desc_section"
                            {...register("desc_section")}

                        />
                        <FloatingInput
                            type={"number"}
                            id="priority_section"
                            min={1}
                            {...register("priority_section")}
                        />
                        <div className="flex justify-center mb-3">
                            <div className="w-full">
                                <select
                                    className="form-select form-select-lg rounded-md appearance-none block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300  transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label=".form-select-sm example"
                                    {...register("type_section", {
                                        onChange: onChangeType,
                                    })}
                                    defaultValue={type}
                                >
                                    <option >Seleccionar</option>
                                    <option value="1">Sectores economicos </option>
                                    <option value="2">Comercios </option>
                                </select>
                            </div>
                        </div>
                        <div className={`flex  mr-3 w-full overflow-auto max-h-[17rem] ${styles.scroll}`}>
                            <ul className="list-unstyled">
                                {
                                    loading ?
                                        (
                                            <div className="flex justify-center">
                                                <p className="ml-[25rem]"><Spinner /></p>
                                            </div>)
                                        : (
                                            data.map((x) => {
                                                return (
                                                    <li className="mb-5 text-reset">
                                                        <div className="flex">
                                                            <input
                                                                type="checkbox"
                                                                className={`type mr-3 w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 type`}
                                                                value={x.path}
                                                                id={x.id}

                                                            />

                                                            <label
                                                                className="flex"
                                                                htmlFor={x.id}

                                                            >
                                                                <div className="mr-3">
                                                                    {
                                                                        (x.logo)
                                                                            ?
                                                                            (<img
                                                                                width={64}
                                                                                alt=''
                                                                                height={64}
                                                                                src={x.logo}
                                                                            />)
                                                                            : ''
                                                                    }

                                                                </div>
                                                                <div className="mr-3">
                                                                    {x?.nickName || x?.name}
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </li>
                                                );
                                            })
                                        )
                                }
                            </ul>
                        </div>

                        <button
                            type="submit"
                            className=" w-full mt-3 ml-1 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-slate-500 hover:shadow-lg focus:bg-blue-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mr-3">
                            Guardar
                        </button>
                    </form>
                </div>
            </div>
        </div>

    );
}
export default FormSections;