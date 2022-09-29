import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import Link from 'next/link';
import { FaListUl } from 'react-icons/fa';
import { useRouter } from 'next/router';

import { db_client } from '../../../firebase/client';
import { checkingCommerce } from '../../../components/Helpers/chekingComerce';
import { toast } from 'react-hot-toast';
import { Store } from '../../../types/store';

import { CloneStore } from "../../../app/business/stores/components/CloneStore";
import { Commerce } from '../../../types/comerce';
interface Nombres {
    name: string;
}


export const RowStores = ({ values }: { values: Store }): JSX.Element => {
    const [nameSector, setNameSector] = useState('');
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);

    const router = useRouter();
    const { idBusiness } = router.query
   

    const handleStatusChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        await checkingCommerce(
            `/empresas/${idBusiness}/comercios/${values.id}`,
            e.target.checked
        );
        setLoading(false);
    };

    const handleStatus = async (e: ChangeEvent<HTMLInputElement>) => {
        setLoading2(true);
        await updateDoc(doc(db_client, `/empresas/${idBusiness}/comercios/${values.id}`), {

            abierto: e.target.checked,

        });

        (e.target.checked)
            ? toast.success("Atendiendo")
            : toast.success("Cerrado")


        setLoading2(false);
    };

    useEffect(() => {
        getDoc(values.sectorEconomico)
            .then((snap) => {
                const { name } = snap.data() as Nombres;
                setNameSector(name);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);


    return (
        <>

            <tr>
                <td>
                    <div className="form-control">
                        <label className="cursor-pointer label">
                            <input type="checkbox" className="checkbox checkbox-secondary" />
                        </label>
                    </div>
                </td>
                <td>
                    <img
                        src={values.banner}
                        width={64}
                        height={64}
                    />
                </td>
                <td>{!loading && nameSector}</td>
                <td> {values.nombre} </td>
                <td>
                    {
                        (loading)
                            ?
                            (
                                <div
                                    className='spinner-border text-light spinner-border-sm'
                                    role='status'>
                                    <span className='visually-hidden'>Loading...</span>
                                </div>

                            )
                            : (
                                < input
                                    type="checkbox"
                                    className="toggle toggle-secondary h-[1.2rem]"
                                    checked={values.status}
                                    onChange={handleStatusChange}
                                />
                            )
                    }
                </td>
                <td>
                    <label className="label cursor-pointer">
                        {
                            (loading2)
                                ?
                                (<p>loading...</p>)
                                :
                                (
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-secondary h-[1.2rem]"
                                        checked={values.abierto}
                                        onChange={handleStatus}
                                    />
                                )
                        }

                    </label>

                </td>

                <td>

                    <div className="dropdown dropdown-left  dropdown-hover dropdown-[1rem] m-0">
                        <label tabIndex={0} className="btn m-1 btn-sm btn-primary "> <FaListUl /></label>
                        <ul tabIndex={0} className="dropdown-content bg-amber-200 menu p-2 shadow rounded-box w-25 border border-amber-400">
                            <li>
                                <Link href={`/empresas/${idBusiness}/tiendas/${values.id}/areas/`}>
                                    <a className='text-medium'>Areas</a>
                                </Link>
                            </li>

                            <li>
                                <Link href={`/empresas/${idBusiness}/tiendas/${values.id}/productos/`}>
                                    <a className='text-medium'>Productos</a>
                                </Link>
                            </li>
                            <li>
                                <Link href={`/empresas/${idBusiness}/tiendas/${values.id}/horarios/`}>
                                    <a className='text-medium'>Horarios</a>
                                </Link>
                            </li>
                            <li className='bg-amber-400 text-medium'>
                                <button
                                    className='btn btn-sm bg-amber-400 border-amber-400 lowercase hover:bg-amber-400 hover:border-amber-400'
                                    onClick={()=>setShowModal(true)}
                                >
                                    Clonar
                                </button>
                            </li>
                         
                        </ul>
                    </div>

                </td>
            </tr>
            <CloneStore
                isVisible={showModal}
                onClose={()=>setShowModal(false)}

            />
        </>
    );
};
