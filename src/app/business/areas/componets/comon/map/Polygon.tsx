import { GeoPoint } from 'firebase/firestore';
import { FC, useEffect, useState } from 'react';
import { useMap } from '../../stateManagement/mapContext';

interface Props extends google.maps.PolygonOptions {
  id?: number | null;
}

export const Polygon: FC<Props> = ({ id, ...options }: Props) => {
  const [polygon, setPolygon] = useState<google.maps.Polygon>();
  const context = useMap();

  useEffect(() => {
    if (!polygon) {
      setPolygon(new google.maps.Polygon());
    }

    return () => {
      if (polygon) {
        polygon.setMap(null);
      }
    };
  }, [polygon]);

  useEffect(() => {
    if (polygon) {
      const setPoints = () => {
        let paths: GeoPoint[] = [];

        polygon.getPath().forEach((path: google.maps.LatLng) => {
          paths.push(new GeoPoint(path.lat(), path.lng()));
        });

        if (id) {
          localStorage.setItem(id + '', JSON.stringify(paths));
        }
      };

      polygon.setOptions(options);

      if (id) {
        polygon.addListener('click', () => {
          context?.selectArea(id);
        });
      }

      polygon.getPath()?.addListener('set_at', setPoints);
      polygon.getPath()?.addListener('insert_at', setPoints);
    }
  }, [polygon, options]);

  return null;
};
