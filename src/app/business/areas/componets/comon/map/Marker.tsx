import { FC, useEffect, useState } from 'react';
import { useMap } from '../../stateManagement/mapContext';

interface Props extends google.maps.MarkerOptions {
  id?: number;
}

export const Marker: FC<Props> = ({ id, ...options }: Props) => {
  const [marker, setMarker] = useState<google.maps.Marker>();
  const context = useMap();

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    const deletePoint = (id: number) => context?.handleDelete(id);

    if (marker) {
      marker.setOptions(options);

      if (id) {
        marker.addListener('rightclick', () => deletePoint(id));
        marker.addListener('dblclick', () => deletePoint(id));
      }
    }
  }, [marker, options]);

  return null;
};
