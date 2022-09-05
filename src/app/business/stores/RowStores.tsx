import { getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Store } from '../../../types/store';
import { IoMdBusiness } from 'react-icons/io';

interface Nombres {
    name: string;
}

export const RowStores = ({ values }: { values: Store }) => {
    const [nameSector, setNameSector] = useState('');
    const [loading, setLoading] = useState(true);

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
                    <img
                        src={values.banner}
                        width={64}
                        height={64}
                    />
                </td>
                <td>{!loading && nameSector}</td>
                <td> {values.nombre} </td>
                <td>
                    {(values.abierto)
                        ? 'Abierto'
                        : 'Cerrado'}
                </td>
                <td className='flex'>
                    <div className="form-control mr-3">
                        <label className="label cursor-pointer">
                            <input type="checkbox" className="toggle toggle-accent" checked />
                        </label>
                    </div>

                    <Link href={`/empresas/${values.id}/tiendas/productos/`}>
                        <button className='btn btn-primary btn-sm mr-3 mt-1' >
                            Productos
                        </button>
                    </Link>
                </td>
            </tr>

        </>
    );
};
