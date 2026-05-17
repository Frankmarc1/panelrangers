import Head from 'next/head';
import Link from 'next/link';

import { Dashboard } from '../layout/Dashboard/Dashboard';

const DashboardPage = () => {
  return (
    <Dashboard>
      <Head>
        <title>Dashboard</title>
      </Head>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        <Link href="/motorizados">
          <a
            style={{
              background: '#ffffff',
              borderRadius: 12,
              padding: 20,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              color: '#111827',
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              Motorizados
            </h2>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Ver, buscar y administrar motorizados.
            </p>
          </a>
        </Link>

        <Link href="/subs">
          <a
            style={{
              background: '#ffffff',
              borderRadius: 12,
              padding: 20,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              color: '#111827',
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              Subscripciones
            </h2>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Revisar solicitudes y aceptar nuevos Rangers.
            </p>
          </a>
        </Link>

        <Link href="/promociones">
          <a
            style={{
              background: '#ffffff',
              borderRadius: 12,
              padding: 20,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              color: '#111827',
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              Promociones
            </h2>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Administrar promociones de VeryGo.
            </p>
          </a>
        </Link>

        <Link href="/empresas">
          <a
            style={{
              background: '#ffffff',
              borderRadius: 12,
              padding: 20,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              color: '#111827',
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
              Empresas
            </h2>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Gestionar empresas y negocios aliados.
            </p>
          </a>
        </Link>
      </div>
    </Dashboard>
  );
};

export default DashboardPage;