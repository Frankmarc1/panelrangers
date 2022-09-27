import { doc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';

import { db_client } from '../../../../../firebase/client';
import { mapContext, Map, Area, Point } from './mapContext';

export const MapProvider: FC = ({ children }): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState<Area[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [store, setStore] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: -5.30899082575,
    lng: -80.7625713371,
  });
  const router=useRouter();
  const {idBusiness}=router.query;
  const {idComercio}=router.query;
  const [idArea, setIdArea] = useState<number | undefined>(undefined);


  const savePoint = (point: google.maps.LatLng) => {
    setPoints((p) => [
      ...p,
      {
        coors: point,
        id: Date.now(),
      },
    ]);
  };

  const handleDelete = (id: number) => {
    const filterMarkers = points.filter((point) => {
      return point.id !== id;
    });

    setPoints(filterMarkers);
  };

  const selectArea = (id: number) => setIdArea(id);
  const deselectArea = () => setIdArea(undefined);

  const clearPoints = () => setPoints([]);

  const values: Map = {
    areas,
    points,
    savePoint,
    store,
    clearPoints,
    handleDelete,
    selectArea,
    idArea,
    deselectArea,
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db_client, `/empresas/${idBusiness}/comercios/${idComercio}`),
      (snap) => {
        if (snap.exists()) {
          const {
            areas = [],
            address: { location },
          } = snap.data();

          setStore({
            lat: location.latitude,
            lng: location.longitude,
          });

          setAreas(areas);
          setLoading(false);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

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
