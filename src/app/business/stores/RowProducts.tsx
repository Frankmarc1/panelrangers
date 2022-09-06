import Link from 'next/link'
import { Product } from '../../../types/product';

export const RowProducts = ({ values }: { values: Product }) => {

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
                <td>
                    {
                        values.tipos.map((tipo) =>
                            <>
                                {
                                (!tipo.price) && !tipo.name
                                    ? ' '
                                    : tipo.name + '  ' + 'S./ ' + Math.round(tipo.price).toFixed(2) + ' / '
                            
                                }   
                            </>
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
