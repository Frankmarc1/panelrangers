import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { db_client } from '../../../firebase/client';
import { Motorized } from '../../../types/motorized';
import { Report } from '../../../types/report';

export const RowMotorized = ({ values }: { values: Motorized }) => {
  const [lastReportDate, setLastReportDate] = useState('');
  const [isDebtor, setIsDebtor] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);

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
          DateTime.fromSeconds(lastReport.fecha_registro.seconds).toFormat(
            'HH:mm / dd-MM-yy'
          )
        );
      }
      setLoading1(false);
    });

    getDocs(queryIsDebtor).then((snap) => {
      setIsDebtor(snap.empty);
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
        ) : isDebtor ? (
          'Deuda'
        ) : (
          'No debe'
        )}
      </td>
    </tr>
  );
};
