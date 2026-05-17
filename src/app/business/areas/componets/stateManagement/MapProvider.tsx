import { doc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import { db_client } from '../../../../../firebase/client';
import { mapContext, Map, Area, Point } from './mapContext';

interface MapProviderProps {
  children: ReactNode;
}

export const MapProvider = ({ children }: MapProviderProps): JSX.Element => {
  const router = useRouter();
  const { idBusiness, idComercio } = router.query;

  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState<Area[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [idArea, setIdArea] = useState<number | undefined>(undefined);

  const [store, setStore] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: -5.30899082575,
    lng: -80.7625713371,
  });

  const savePoint = (point: google.maps.LatLng) => {
    setPoints((currentPoints) => [
      ...currentPoints,
      {
        coors: point,
        id: Date.now(),
      },
    ]);
  };

  const handleDelete = (id: number) => {
    setPoints((currentPoints) =>
      currentPoints.filter((point) => point.id !== id)
    );
  };

  const selectArea = (id: number) => {
    setIdArea(id);
  };

  const deselectArea = () => {
    setIdArea(undefined);
  };

  const clearPoints = () => {
    setPoints([]);
  };

  const values: Map = useMemo(
    () => ({
      areas,
      points,
      savePoint,
      store,
      clearPoints,
      handleDelete,
      selectArea,
      idArea,
      deselectArea,
    }),
    [areas, points, store, idArea]
  );

  useEffect(() => {
    if (!router.isReady) return;

    if (typeof idBusiness !== 'string' || typeof idComercio !== 'string') {
      setLoading(false);
      return;
    }

    setLoading(true);

    const comercioRef = doc(
      db_client,
      'empresas',
      idBusiness,
      'comercios',
      idComercio
    );

    const unsubscribe = onSnapshot(
      comercioRef,
      (snap) => {
        if (!snap.exists()) {
          setAreas([]);
          setLoading(false);
          return;
        }

        const data = snap.data();

        const areasData = Array.isArray(data.areas) ? data.areas : [];
        const location = data.address?.location;

        if (location?.latitude && location?.longitude) {
          setStore({
            lat: location.latitude,
            lng: location.longitude,
          });
        }

        setAreas(areasData);
        setLoading(false);
      },
      (error) => {
        console.error('Error escuchando comercio:', error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [router.isReady, idBusiness, idComercio]);

  return (
    <div>
      {loading ? (
        <p>cargando ...</p>
      ) : (
        <mapContext.Provider value={values}>{children}</mapContext.Provider>
      )}
    </div>
  );
};