import { IoMdAddCircle } from "react-icons/io";
import { useEffect, useState } from "react";
import { collection, CollectionReference, DocumentData, getDoc, onSnapshot } from "firebase/firestore";

import { Dashboard } from "../../layout/Dashboard/Dashboard"
import { db_client } from "../../firebase/client";
import styles from '../../../styles/index.module.css';

export const FormMainCategorys = () => {
    const [data, setData] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const colRef: CollectionReference = collection(db_client, 'sector_economicos');

    useEffect(() => {
        const unsubscribe = onSnapshot(colRef, (snap) => {
            if (!snap.empty) {
                setData(snap.docs.map((doc) => doc.data()));
            }

            setLoading(false);
        });
        return () => {
            setData([]);
            unsubscribe();
        };

    }, []);
    return (
        <Dashboard>
            <div className="card border border-slate-300 bg-slate-50 rounded ">
                <div className="card-header flex justify-center border-b py-2">
                    <h3 className="card-title font-medium"> Agregar Categoria</h3>
                </div>
                <div className="card-body">
                    <form>
                        <div className="flex justify-center items-center w-full mb-4    ">
                            <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-full h-[4rem] bg-white rounded-lg border border-gray-400  cursor-pointer dark:hover:bg-bray-100 dark:bg-gray-100 hover:bg-gray-100 dark:border-gray-200 dark:hover:border-gray-50 dark:hover:bg-gray-300">
                                <div className="flex  justify-center items-center pt-5 pb-6 font-medium">
                                    <p className="font-semibold mt-1 mr-2 text-xl"><IoMdAddCircle /></p> Agregar Imagen
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" />
                            </label>
                        </div>
                        <div className='mb-5 '>
                            <input
                                type='text'
                                id='name'
                                placeholder="Name... !"
                                className='w-full  rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                            />
                        </div>
                        <div className="form-control">

                            <ul className={`${styles.gridCol2}`}>
                                {(loading)
                                    ? <p className="flex justify-center">Cargando ...</p>
                                    :
                                    data.map((x) => (
                                        <li >
                                            <label className="label cursor-pointer">
                                                <input type="checkbox" className="checkbox border border-slate-500 mr-1 " />
                                                <p className="font-medium">{x.name}</p>
                                            </label>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <button
                            type="button"
                            className="mt-3 ml-1 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-slate-500 hover:shadow-lg focus:bg-blue-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mr-3">
                            <p className="font-medium text-[1rem]">Editar</p>
                        </button>
                    </form>
                </div>

            </div>
        </Dashboard>
    );
}

