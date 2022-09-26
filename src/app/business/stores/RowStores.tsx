import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ChangeEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { db_client } from '../../../firebase/client';
import { checkingCommerce } from '../../../components/Helpers/chekingComerce';
import { toast } from 'react-hot-toast';
import { StatusHandler } from '../../../common/statusHndler/StatusHandler';
import { Store } from '../../../types/store';

interface Nombres {
    name: string;
}

export const RowStores = ({ values }: { values: Store }) => {
    const [nameSector, setNameSector] = useState('');
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState<boolean>(false);

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
                            <input type="checkbox"  className="checkbox checkbox-secondary" />
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

                <td className='flex'>
                    <Link href={`/empresas/${idBusiness}/tiendas/${values.id}/productos/`}>
                        <button className='btn btn-primary btn-sm mr-3 mt-1' >
                            Productos
                        </button>
                    </Link>
                </td>
            </tr>

        </>
    );
};
