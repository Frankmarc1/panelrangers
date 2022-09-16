import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import {
  FaBuilding,
  FaClipboardList,
  FaCopy,
  FaHome,
  FaListUl,
  FaMotorcycle,
  FaRandom,
  FaRegBuilding,
  FaSquare,
  FaUsers,
} from 'react-icons/fa';
import { IconType } from 'react-icons/lib';
import { useRouteMatch } from '../../hooks/useRouteMatch';

interface props {
  children: ReactNode | ReactNode[];
}

interface Menu {
  title: string;
  href: string;
  icon: JSX.Element;
  gap?: boolean;
}
export const Dashboard = ({ children }: props) => {
  const [open, setOpen] = useState(true);
  const searchPath = useRouteMatch();

  const Menus: Menu[] = [
    { title: 'Usuarios', href: '/usuarios', icon: <FaUsers /> },
    { title: 'Motorizados', href: '/motorizados', icon: <FaMotorcycle /> },
    { title: 'Agencias', href: '/agencias', icon: <FaHome /> },
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
      title: 'Secciones',
      href: '/secciones',
      icon: <FaSquare />,
    },
  ];

  return (
    <>
      <Toaster
        position='top-right'
        gutter={8}
        reverseOrder={false}
        toastOptions={{ duration: 5000 }}
      />

      <div className='flex'>
        <div
          className={` ${
            open ? 'w-72' : 'w-20 '
          } bg-dark-purple  p-5  pt-8 relative duration-300`}
        >
          <img
            src='/control.png'
            className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
           border-2 rounded-full  ${!open && 'rotate-180'}`}
            onClick={() => setOpen(!open)}
          />

          <div className='flex gap-x-4 items-center'>
            <FaRandom
              className={`cursor-pointer duration-500  text-white ${
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
          <ul className='pt-6'>
            {Menus.map((menu, index) => (
              <Link href={menu.href}>
                <a
                  key={index}
                  className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
              ${menu.gap ? 'mt-9' : 'mt-2'} ${
                    searchPath(menu.href.split('/')[1]) && 'bg-light-white'
                  } `}
                >
                  {menu.icon}
                  <span
                    className={`${!open && 'hidden'} origin-left duration-200`}
                  >
                    {menu.title}
                  </span>
                </a>
              </Link>
            ))}
          </ul>
        </div>
        <div className={`h-screen flex-1 p-7 ${ open ? 'max-w-[80.2%]': 'w-full'}`}>{children}</div>
      </div>
    </>
  );
};
