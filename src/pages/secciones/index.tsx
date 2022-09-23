import { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { StatusHandler } from "../../common/statusHndler/StatusHandler";
import { collection, query, onSnapshot, DocumentData, DocumentReference, getDoc, doc } from "firebase/firestore";
import { Dashboard } from "../../layout/Dashboard/Dashboard";
import { db_client } from "../../firebase/client";

import { Spinner } from "../../components/spinner/Spinner";
import styles from '../../../styles/index.module.css';
import { DataSection } from "../../components/Sections/DataSection";
import Link from "next/link";



const Secciones = () => {
    const [data, setData] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const onSubscribe = onSnapshot(
            query(collection(db_client, 'home/')),
            (snap: { empty: any; docs: any[]; }) => {
                if (!snap.empty) {
                    setData(snap.docs.map((doc) => doc.data()));
                }
                setLoading(false);
            }
        );
        onSubscribe;

    }, []);


    return (
        <Dashboard>

            <div className={`${styles.scroll} overflow-auto h-auto max-h-[35rem]`}>
                {
                    data.map((d) => (
                        <div className={`flex justify-center mb-4`}>
                            <div className="block rounded-lg shadow-lg bg-white  w-3/4 text-center">
                                <div className="">
                                    {loading
                                        ? <Spinner />
                                        : (
                                            <DataSection
                                                name={d.name}
                                                desc={d.description}
                                                data={
                                                    d.sectoresEconomicos || d.comerciosReference
                                                }
                                                key={d.id}

                                            />
                                        )
                                    }
                                </div>
                                <div className="py-3 px-6 border-t border-gray-300 text-gray-600">
                                    <div className="flex">

                                        <Link href={`secciones/${d.id}`}>
                                            <button
                                                type="button"
                                                className="inline-block px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-slate-500 hover:shadow-lg focus:bg-blue-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mr-3">
                                                <div className="flex">
                                                    <p className="mr-1 text-[0.9rem] mt-1"><FaPencilAlt /></p>
                                                    <p className="font-medium text-[1rem]">Editar</p>
                                                </div>

                                            </button>

                                        </Link>
                                        <div className="form-control flex justify-end">
                                            <StatusHandler
                                                collectionName="home"
                                                data={d}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))
                }
            </div>
            <div className="justify-center flex">
                <Link href={"/secciones/add"}>
                    <button className=" w-3/4 border border-slate-400 bg-slate-300 font-medium  rounded-md" >
                        <div className="flex justify-center py-4">
                            <p className="mt-1 mr-2 text-xl"><IoMdAddCircle /></p>
                            Agregar Home
                        </div>
                    </button>
                </Link>
            </div>
        </Dashboard>

    );
}
export default Secciones;