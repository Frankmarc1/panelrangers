import { FaSave, FaPencilAlt } from "react-icons/fa";
import { AiOutlineCheck } from "react-icons/ai";
import { FC, useEffect, useState } from "react";
import { FcCancel } from "react-icons/fc";
import Link from "next/link";
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { collection, doc, DocumentData, getDoc, onSnapshot, query, setDoc, updateDoc } from "firebase/firestore";
import { db_client } from "../../firebase/client";
import style from '../../../styles/index.module.css'
import { FloatingInput } from "../../components/Inputs/FloatingInput";
import { isValidName } from "../../app/sectorEconimic/schema/schemaSector";
import { StatusHandler } from "../../common/statusHndler/StatusHandler";
export type Inputs = {
    name_sector: string;
};
interface Sector {
    id: string;
    name: string;
    status: boolean;
}
const ListSectors: FC = (): JSX.Element => {
    const [data, setData] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const {
        register,
        handleSubmit,
        reset,
        setValue,

    } = useForm<Inputs>();
    const router = useRouter();

    const { idSectors } = router.query;

    useEffect(() => {
        if (idSectors) {
            getDoc(doc(db_client, `sector_economicos/${idSectors}`))
                .then((snap) => {
                    if (snap.exists()) {
                        const {
                            name,

                        } = snap.data();

                        setValue('name_sector', name);

                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }else{
            document.getElementById('name_sector')?.focus()
        }
    }, [idSectors]);
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const docRef = idSectors
            ? doc(db_client, `sector_economicos/${idSectors}`)
            : doc(collection(db_client, 'sector_economicos'));
        try {

            if (!data.name_sector) {
                toast.error("Nombre se encuntra vacio")
                document.getElementById('name_sector')?.focus();
                return
            }
            if (!isValidName(data.name_sector)) {
                toast.error("Nombre no es valido")
                document.getElementById('name_sector')?.focus();
                return
            }

            let obj: Sector = {
                id: docRef.id,
                name: data.name_sector.trim(),
                status: true,

            }
            //await handleForm(data, idSector);
            if (idSectors) {
                await updateDoc(docRef, {
                    ...obj,
                });
                toast.success('Sector Actualizado con exito.')
                router.push('/sectores-economicos');
            } else {
                await setDoc(docRef, obj)
                toast.success('Sector Creado con exito.')
            }
            reset();

        } catch (err) {

            console.error(err);
        }
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
                                id="name_sector"
                                {...register('name_sector')}
                                autoComplete='off'
                            />
                        </div>
                        {
                            (!idSectors)
                                ?
                                <button className='btn btn-primary btn-md text-md'>
                                    <FaSave />
                                </button>
                                :
                                <div className='flex align-items-center'>

                                    <button className=' text-white mr-4' type='submit'>

                                        <p className="text-success text-xl"><AiOutlineCheck /></p>

                                    </button>

                                    <button className="text-white text-xl">
                                        <Link
                                            href={'/sectores-economicos'}
                                            className='btn btn-tool text-danger'
                                        >
                                            <FcCancel />
                                        </Link>
                                    </button>
                                </div>
                        }
                    </div>
                </form>
                <div className={`overflow-auto h-auto max-h-[33.3rem] ${style.scroll}`}>

                    {
                        loading
                            ?
                             <p> Cargando...</p>
                            :
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
                                                <button
                                                    className="flex justify-end mr-3 text-primary text-xl">
                                                    <FaPencilAlt />
                                                </button>

                                            </Link>
                                            <div className="form-control flex justify-end">
                                                <StatusHandler collectionName='sector_economicos' data={x} />
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
export default ListSectors;
