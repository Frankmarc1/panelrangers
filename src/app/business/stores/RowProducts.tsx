import Link from 'next/link'
import { db_client } from '../../../firebase/client';
import { useRouter } from 'next/router';
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { Product } from '../../../types/product';
interface Category {
    name: string;
}

export const RowProducts = ({ values }: { values: Product }) => {
    const [nameCategoria, setNamecategoria] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { idBusiness } = router.query;
    const { idComercio } = router.query;

    useEffect(() => {
        const listCategorias = async () => {
            const docRef = doc(db_client, `/empresas/${idBusiness}/comercios/${idComercio}/categorias/${values.categoria}`);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const { name } = docSnap.data() as Category;
                setNamecategoria(name);
                console.log("Document data:", docSnap.data());

            } else {

                console.log("No such document!");

            }
        }
        listCategorias();
        setLoading(false);
    }, []);

    return (
        <>
            <tr>
                <td>
                    <img
                        src={values.img}
                        width={64}
                        height={64}
                        alt={values.img}
                    />
                </td>
                <td>
                    <ul>
                        <li className='font-semibold text-[16px]'>{(values.name)}</li>
                        <li className='text-sm font-mediun '> {values.descripcion}</li>

                    </ul>
                </td>
                <td>{!loading && nameCategoria}</td>
                <td>
                    {
                        values.tipos.map((tipo) =>
                            <span>

                                {
                                    (!tipo.name)
                                        ? ''
                                        : tipo.name} {(!tipo.price)
                                            ? ''
                                            : 'S/. ' + (Math.round(tipo.price).toFixed(2) + ' ')
                                }


                            </span>


                        )

                    }
                </td>
                <td>
                    <Link href={`/empresas`}>
                        <button className='btn btn-primary btn-sm mr-3 mt-1' >
                            Detalles
                        </button>
                    </Link>
                </td>

            </tr>

        </>
    );
};
