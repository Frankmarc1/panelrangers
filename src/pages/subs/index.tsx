import {
  collection,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import Head from 'next/head';
import { useMemo, useState } from 'react';

import { RowSubs } from '../../app/motorized/RowSubs';
import { FirebaseDataTable } from '../../components/FirebaseDataTable/FirebaseDataTable';
import { MotorizedTabs } from '../../components/MotorizedTabs/MotorizedTabs';
import { db_client } from '../../firebase/client';
import { Dashboard } from '../../layout/Dashboard/Dashboard';
import { normalizePeruPhoneForSearch } from '../../utils/phone';

const normalizeUpperText = (value: string): string => {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim()
    .replace(/\s+/g, ' ');
};

const inputStyle = {
  width: '100%',
  maxWidth: 260,
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid #d1d5db',
  outline: 'none',
  fontSize: 14,
} as const;

const Subs = () => {
  const [phoneSearch, setPhoneSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [lastNameSearch, setLastNameSearch] = useState('');

  const normalizedPhoneSearch = useMemo(() => {
    return normalizePeruPhoneForSearch(phoneSearch);
  }, [phoneSearch]);

  const normalizedNameSearch = useMemo(() => {
    return normalizeUpperText(nameSearch);
  }, [nameSearch]);

  const normalizedLastNameSearch = useMemo(() => {
    return normalizeUpperText(lastNameSearch);
  }, [lastNameSearch]);

  const tableKey = useMemo(() => {
    return [
      normalizedPhoneSearch,
      normalizedNameSearch,
      normalizedLastNameSearch,
    ].join('-');
  }, [
    normalizedPhoneSearch,
    normalizedNameSearch,
    normalizedLastNameSearch,
  ]);

  const subsQuery = useMemo(() => {
    const subsRef = collection(db_client, 'suscripciones');

    if (normalizedPhoneSearch.length > 0) {
      return query(
        subsRef,
        orderBy('phoneSearch'),
        where('phoneSearch', '>=', normalizedPhoneSearch),
        where('phoneSearch', '<=', `${normalizedPhoneSearch}\uf8ff`)
      );
    }

    if (normalizedNameSearch.length > 0) {
      return query(
        subsRef,
        orderBy('profile.name'),
        where('profile.name', '>=', normalizedNameSearch),
        where('profile.name', '<=', `${normalizedNameSearch}\uf8ff`)
      );
    }

    if (normalizedLastNameSearch.length > 0) {
      return query(
        subsRef,
        orderBy('profile.lastName'),
        where('profile.lastName', '>=', normalizedLastNameSearch),
        where('profile.lastName', '<=', `${normalizedLastNameSearch}\uf8ff`)
      );
    }

    return query(
      subsRef,
      orderBy('timeUp', 'desc')
    );
  }, [
    normalizedPhoneSearch,
    normalizedNameSearch,
    normalizedLastNameSearch,
  ]);

  const clearFilters = () => {
    setPhoneSearch('');
    setNameSearch('');
    setLastNameSearch('');
  };

  const hasFilters =
    phoneSearch.trim().length > 0 ||
    nameSearch.trim().length > 0 ||
    lastNameSearch.trim().length > 0;

  return (
    <Dashboard>
      <Head>
        <title>Subscripciones</title>
      </Head>

      <div
        style={{
          width: '100%',
          overflowX: 'auto',
          marginBottom: 16,
        }}
      >
        <MotorizedTabs />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 18,
          flexWrap: 'wrap',
          width: '100%',
        }}
      >
        <input
          type="text"
          value={phoneSearch}
          onChange={(event) => {
            setPhoneSearch(event.target.value);
            setNameSearch('');
            setLastNameSearch('');
          }}
          placeholder="Buscar por teléfono..."
          style={inputStyle}
        />

        <input
          type="text"
          value={nameSearch}
          onChange={(event) => {
            setNameSearch(event.target.value);
            setPhoneSearch('');
            setLastNameSearch('');
          }}
          placeholder="Buscar por nombre..."
          style={inputStyle}
        />

        <input
          type="text"
          value={lastNameSearch}
          onChange={(event) => {
            setLastNameSearch(event.target.value);
            setPhoneSearch('');
            setNameSearch('');
          }}
          placeholder="Buscar por apellido..."
          style={inputStyle}
        />

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            style={{
              width: '100%',
              maxWidth: 160,
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              background: '#ffffff',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Limpiar
          </button>
        )}
      </div>

      <div
        style={{
          width: '100%',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          style={{
            minWidth: 850,
          }}
        >
          <FirebaseDataTable
            key={tableKey}
            qi={subsQuery}
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
        </div>
      </div>
    </Dashboard>
  );
};

export default Subs;