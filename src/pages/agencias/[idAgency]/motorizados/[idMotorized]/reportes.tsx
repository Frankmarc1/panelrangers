import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { RowReports } from '../../../../../app/agencies/motorized/RowReports';
import { FirebaseDataTable } from '../../../../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../../../../firebase/client';
import { Dashboard } from '../../../../../layout/Dashboard/Dashboard';
import { Motorized } from '../../../../../types/motorized';
import { Params } from '../../../../../types/params';
import { Report } from '../../../../../types/report';
import { currencyFormat } from '../../../../../utils/strFormat';

interface Props {
  nameOfMotorized: string;
}

export const getServerSideProps: GetServerSideProps<{}, Params> = async ({
  params,
}) => {
  const snap = await getDoc(
    doc(db_client, `users_motorizados/${params?.idMotorized}`)
  );
  const data = snap.data() as Motorized;

  return {
    props: {
      nameOfMotorized: data.profile.name + ' ' + data.profile.lastName,
    },
  };
};

const Reports = ({ nameOfMotorized }: Props) => {
  const [resumen, setResumen] = useState<{
    totalPayments: number;
    totalDebt: number;
    totalHoursCommision: number;
    totalHoursPartTime: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { idMotorized } = router.query;

  useEffect(() => {
    const unSubsribe = onSnapshot(
      query(
        collection(
          db_client,
          `/users_motorizados/${idMotorized}/agencia_reporte_pedidos`
        ),
        where('estado', 'not-in', ['ELIMINADO', 'MIGRADO'])
      ),
      (snap) => {
        const reports: Report[] = snap.docs.map((doc) => doc.data() as Report);
        let totalHoursCommision = 0;
        let totalHoursPartTime = 0;

        reports.forEach((report) => {
          if (report.registro_horas) {
            totalHoursCommision += report.registro_horas
              .filter((value) => value.tipo === 'Comisión')
              .map((register) => register.horas)
              .reduce((a, b) => a + b, 0);

            totalHoursPartTime += report.registro_horas
              .filter((value) => value.tipo === 'Part time')
              .map((register) => register.horas)
              .reduce((a, b) => a + b, 0);
          }
        });

        setResumen({
          totalPayments: reports
            .map((report) => report.pago)
            .reduce((a, b) => a + b, 0),
          totalDebt: reports
            .map((report) => report.deuda)
            .reduce((a, b) => a + b, 0),
          totalHoursPartTime,
          totalHoursCommision,
        });
        setLoading(false);
      }
    );

    return () => {
      unSubsribe();
    };
  }, []);

  return (
    <Dashboard>
      <header className='mb-4'>
        <h1 className='mb-4'>Reportes de {nameOfMotorized}</h1>
        {loading ? (
          <div className='flex justify-center'>
            <button className='btn btn-ghost loading btn-sm'></button>
          </div>
        ) : (
          <div className='grid grid-cols-3'>
            <p className='text-xs'>
              {' '}
              Pagos:{' '}
              <span className='text-sm text-green-500 mx-2 font-bold'>
                {currencyFormat(resumen?.totalPayments || 0)}
              </span>{' '}
            </p>
            <p className='text-xs'>
              {' '}
              Deuda:
              <span className='text-sm text-red-500 mx-2 font-bold'>
                {currencyFormat(resumen?.totalPayments || 0)}
              </span>{' '}
            </p>
            <p className='text-xs'>
              {' '}
              Horas:{' '}
              <span className='text-sm font-bold'>{`${
                resumen?.totalHoursCommision || 0
              } horas de comisión y ${
                resumen?.totalHoursPartTime || 0
              } horas de part time`}</span>{' '}
            </p>
          </div>
        )}
      </header>

      <FirebaseDataTable
        headers={[
          '#pedidos',
          'Nombre',
          'Observacion',
          'Deuda',
          'Total',
          'Descuentos',
          'Porcentaje',
          'Estado',
          'Horas',
          'Acciones',
        ]}
        qi={query(
          collection(
            db_client,
            `/users_motorizados/${idMotorized}/agencia_reporte_pedidos`
          ),
          orderBy('fecha_registro', 'desc')
        )}
        RowComponent={RowReports}
      />
    </Dashboard>
  );
};

export default Reports;
