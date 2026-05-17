import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { FaStore } from 'react-icons/fa';
import {
  FaBuilding,
  FaClipboardList,
  FaHome,
  FaListUl,
  FaMotorcycle,
  FaRandom,
  FaSquare,
  FaTags,
  FaUsers,
} from 'react-icons/fa';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';

import { auth_client } from '../../firebase/client';
import { useRouteMatch } from '../../hooks/useRouteMatch';

interface Props {
  children: ReactNode | ReactNode[];
}

interface Menu {
  title: string;
  href: string;
  icon: JSX.Element;
  gap?: boolean;
}

export const Dashboard = ({ children }: Props) => {
  const [open, setOpen] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const router = useRouter();
  const searchPath = useRouteMatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth_client, (user) => {
      if (!user) {
        router.replace('/ingresar');
        return;
      }

      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  const Menus: Menu[] = [
    {
      title: 'Usuarios',
      href: '/usuarios',
      icon: <FaUsers />,
    },
    {
      title: 'Motorizados',
      href: '/motorizados',
      icon: <FaMotorcycle />,
    },
    {
      title: 'Agencias',
      href: '/agencias',
      icon: <FaHome />,
    },
    {
      title: 'Empresas',
      href: '/empresas',
      icon: <FaBuilding />,
      gap: true,
    },
    {
      title: 'Sectores Economicos',
      href: '/sectores-economicos',
      icon: <FaListUl />,
    },
    {
      title: 'Categorias Principales',
      href: '/categorias_principales',
      icon: <FaClipboardList />,
    },
    {
      title: 'Restaurantes VeryGo',
      href: '/restaurantes-verygo',
      icon: <FaStore />,
    },
    {
      title: 'Promociones',
      href: '/promociones',
      icon: <FaTags />,
    },
    {
      title: 'Secciones',
      href: '/secciones',
      icon: <FaSquare />,
    },
  ];

  if (checkingAuth) {
    return (
      <>
        <Toaster
          position="top-right"
          gutter={8}
          reverseOrder={false}
          toastOptions={{ duration: 5000 }}
        />

        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f3f4f6',
            color: '#111827',
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Verificando sesión...
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        gutter={8}
        reverseOrder={false}
        toastOptions={{ duration: 5000 }}
      />

      <div className="flex">
        <div
          className={`${
            open ? 'w-72' : 'w-20'
          } bg-dark-purple p-5 pt-8 relative duration-300`}
        >
          <img
            src="/control.png"
            alt="Abrir o cerrar menú"
            className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple border-2 rounded-full ${
              !open && 'rotate-180'
            }`}
            onClick={() => setOpen(!open)}
          />

          <div className="flex gap-x-4 items-center">
            <FaRandom
              className={`cursor-pointer duration-500 text-white ${
                open && 'rotate-[360deg]'
              }`}
            />

            <h1
              className={`text-white origin-left font-medium text-xl duration-200 ${
                !open && 'scale-0'
              }`}
            >
              RangersDashboard
            </h1>
          </div>

          <ul className="pt-6">
            {Menus.map((menu) => {
              const isActive = searchPath(menu.href.split('/')[1]);

              return (
                <Link href={menu.href} key={menu.href}>
                  <a
                    className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 ${
                      menu.gap ? 'mt-9' : 'mt-2'
                    } ${isActive && 'bg-light-white'}`}
                  >
                    {menu.icon}

                    <span
                      className={`${
                        !open && 'hidden'
                      } origin-left duration-200`}
                    >
                      {menu.title}
                    </span>
                  </a>
                </Link>
              );
            })}
          </ul>
        </div>

        <div
          className={`h-screen flex-1 p-7 ${
            open ? 'max-w-[80.2%]' : 'w-full'
          }`}
        >
          {children}
        </div>
      </div>
    </>
  );
};