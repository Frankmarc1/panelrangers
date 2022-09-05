import { getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {Product} from '../../../types/product';

export const RowProducts = ({ values }: { values: Product }) => {

    return (
        <>
            <tr>
                <td>{values.imagen}</td>
            </tr>

        </>
    );
};
