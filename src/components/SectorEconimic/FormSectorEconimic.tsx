import { FaSave, FaPencilAlt } from "react-icons/fa";
import { FC, useEffect, useState } from "react";
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { collection, DocumentData, onSnapshot, query } from "firebase/firestore";
import { db_client } from "../../firebase/client";

import style from '../../../styles/index.module.css'
import { FloatingInput } from "../Inputs/FloatingInput";
import { useRouter } from "next/router";
export type Inputs = {
    name_sector: String;
}
const FormSectorEconomic: FC = (): JSX.Element => {
    const [data, setData] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { register, handleSubmit,reset } = useForm<Inputs>()
    const router = useRouter();
    const { idSector } = router.query;
    console.log(idSector);
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        console.log(data);
    }

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
        <div className="flex justify-center">
            <div className="block rounded-lg shadow-lg bg-white w-3/4 text-center">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    autoComplete="off"
                >
                    <div className="py-3 px-6 border-b border-gray-300 flex">
                        <div className='mb-[-11px] w-full mr-3'>
                            <FloatingInput
                                placeholder="Nombre ...!"
                                {...register('name_sector')}
                            />

                        </div>
                        {
                            (!idSector)
                                ?
                                <button className='btn btn-primary btn-md text-md'>
                                    <FaSave />
                                </button>
                                :
                                <div className='d-flex align-items-center'>
                                <button className='btn btn-tool text-success' type='submit'>
                                  v
                                </button>
                                <Link
                                  href='/sectores-economicos'
                                  className='btn btn-tool text-danger'
                                  onClick={() => {
                                    reset();
                                  }}>
                                  x
                                </Link>
                              </div>
                    }


                    </div>
                </form>
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
                                        <Link
                                            href={`/sectores-economicos/${x.id}`}

                                        >

                                            <button className="flex justify-end mr-3 text-primary text-xl">
                                                <FaPencilAlt />
                                            </button>

                                        </Link>
                                        <div className="form-control flex justify-end">
                                            <input type="checkbox" className="toggle toggle-accent h-[1.2rem]" />
                                        </div>

                                    </div>
                                </div>

                            </div>
                        ))
                    }
                </div>

            </div>
        </div>
    );
}
export default FormSectorEconomic;