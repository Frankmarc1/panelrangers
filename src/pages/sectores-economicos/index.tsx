import { Dashboard } from "../../layout/Dashboard/Dashboard";
import { FaSave, FaPencilAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { collection, DocumentData, onSnapshot, query } from "firebase/firestore";
import { db_client } from "../../firebase/client";

import style from '../../../styles/index.module.css'

const EconomicSector = () => {
    const [data, setData] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const onSubscribe = onSnapshot(
            query(collection(db_client, 'sector_economicos/')),
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
            <div className="flex justify-center">
                <div className="block rounded-lg shadow-lg bg-white w-3/4 text-center">
                    <div className="py-3 px-6 border-b border-gray-300 flex">
                        <div className='mb-5 w-full mr-3'>
                            <input
                                type='text'
                                name="seacrh"
                                className='w-full  rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                                placeholder="Name... !"
                            />
                        </div>
                        <button className='btn btn-primary btn-sm'>
                            <FaSave />
                        </button>
                    </div>
                    <div className={`overflow-auto h-auto max-h-[33.3rem] ${style.scroll}`}>
                        {
                            data.map((x) => (
                                <div className="p-6 grid grid-cols-2 gap-5">

                                    <div className=" grid grid-cols-1">
                                        <p className="flex justify-start">
                                            {x.name}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 col-end-11 ">
                                        <div className="flex">
                                            <button className="flex justify-end mr-3 text-primary text-xl">
                                                <FaPencilAlt />
                                            </button>
                                            <div className="form-control flex justify-end">
                                                <input type="checkbox" className="toggle toggle-accent h-[1.2rem]" checked />
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </Dashboard>
    );
}
export default EconomicSector;