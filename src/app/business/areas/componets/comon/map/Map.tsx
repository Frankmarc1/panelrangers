import React, { useEffect, useRef, useState } from 'react';

import { useDeepCompareEffectForMaps } from '../../hocks/useDeepCompareEffectForMaps';

interface MapProps extends google.maps.MapOptions {
  style: React.CSSProperties;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
}

export const Map: React.FC<MapProps> = ({
  onClick,
  onIdle,
  children,
  style,
  ...options
}): JSX.Element => {
  const [map, setMap] = useState<google.maps.Map>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [map]);

  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  useEffect(() => {
    if (!map) return;

    google.maps.event.clearListeners(map, 'click');
    google.maps.event.clearListeners(map, 'idle');

    if (onClick) {
      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        onClick(e);
      });
    }

    if (onIdle) {
      map.addListener('idle', () => {
        onIdle(map);
      });
    }
  }, [map, onClick, onIdle]);

  return (
    <>
      <div ref={ref} style={style} />

      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            map,
          });
        }

        return child;
      })}
    </>
  );
};