import { collection, orderBy, query } from 'firebase/firestore';
import Head from 'next/head';
import { RowSubs } from '../../../app/motorized/RowSubs';
import { FirebaseDataTable } from '../../../components/FirebaseDataTable/FirebaseDataTable';
import { db_client } from '../../../firebase/client';
import { Dashboard } from '../../../layout/Dashboard/Dashboard';

const Subs = () => {
  return (
    <Dashboard>
      <Head>
        <title>Subscripciones</title>
      </Head>
      <FirebaseDataTable
        qi={query(collection(db_client, 'suscripciones'), orderBy('id'))}
        headers={[
          'D.N.I',
          'TELEFONO',
          'NOMBRE Y APELLIDOS',
          'DATOS EN LA APP',
          'FECHA DE REGISTRO',
          'ACCIONES',
        ]}
        RowComponent={RowSubs}
      />
    </Dashboard>
  );
};

export default Subs;
