import { useEffect, useState } from 'react';

export const useFavicon = (): string => {
  const [favicon, setFavicon] = useState<string>('/Usuario.png');

  useEffect(() => {
    const item = localStorage.getItem('favicon');

    if (item) setFavicon(item);
  }, []);

  return favicon;
};
