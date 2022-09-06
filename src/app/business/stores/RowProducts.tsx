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
                <td>{values.name}</td>
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
