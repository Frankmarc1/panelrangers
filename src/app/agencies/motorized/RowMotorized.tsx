import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaClipboard } from 'react-icons/fa';
import { db_client } from '../../../firebase/client';
import { Motorized } from '../../../types/motorized';
import { Report } from '../../../types/report';

export const RowMotorized = ({ values }: { values: Motorized }) => {
  const [lastReportDate, setLastReportDate] = useState('');
  const [isDebtor, setIsDebtor] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const router = useRouter();
  const { idAgency } = router.query;

  useEffect(() => {
    const colRef = collection(
      db_client,
      `/users_motorizados/${values.id}/agencia_reporte_pedidos/`
    );
    const queryReports = query(
      colRef,
      orderBy('fecha_registro', 'desc'),
      limit(1)
    );
    const queryIsDebtor = query(colRef, where('deuda', '!=', 0));

    getDocs(queryReports).then((snap) => {
      if (!snap.empty) {
        const lastReport = snap.docs[0].data() as Report;

        setLastReportDate(
          `
					 El ${DateTime.fromSeconds(lastReport.fecha_registro.seconds).toFormat(
             'dd-MM-yy'
           )}  a las ${DateTime.fromSeconds(
            lastReport.fecha_registro.seconds
          ).toFormat('HH:mm')}
					`
        );
      }
      setLoading1(false);
    });

    getDocs(queryIsDebtor).then((snap) => {
      setIsDebtor(!snap.empty);
      setLoading2(false);
    });
  }, []);

  return (
    <tr>
      <td> {values.profile.dni} </td>
      <td>
        {' '}
        {values.profile.name} {values.profile.lastName}{' '}
      </td>
      <td>
        {loading1 ? (
          <button className='btn btn-ghost btn-sm loading'></button>
        ) : (
          lastReportDate
        )}
      </td>

      <td>
        {loading2 ? (
          <button className='btn btn-ghost btn-sm loading'></button>
        ) : (
          <div
            className={`badge badge-md ${
              isDebtor ? 'badge-error' : 'badge-success'
            }`}
          >
            {isDebtor ? 'Deuda' : 'Activo'}
          </div>
        )}
      </td>
      <td>
        <Link
          href={`/dashboard/agencias/${idAgency}/motorizados/${values.id}/reportes`}
        >
          <a className='btn btn-primary btn-sm'>
            <FaClipboard />
          </a>
        </Link>
      </td>
    </tr>
  );
};
