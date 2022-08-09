import { useRouter } from 'next/router';

export const useRouteMatch = () => {
  const router = useRouter();

  const searchPath = (pathSearch: string): boolean =>
    !!router.asPath
      .replace('?', '/')
      .split('/')
      .find((path) => path === pathSearch);

  return searchPath;
};
