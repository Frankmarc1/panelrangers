import Link from 'next/link';
import React from 'react';
import { AiFillHome } from "react-icons/ai";
import { FaUserTie, FaMotorcycle, FaStore, FaPager } from "react-icons/fa";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { ImOffice } from "react-icons/im";
import { HiOfficeBuilding } from "react-icons/hi";

import { useRouteMatch } from '../../../hooks/useRouteMatch';
export const Navbar = () => {
  const searchPath = useRouteMatch();

  return (
    <aside className="flex w-72 flex-col space-y-2 border-r-2 border-gray-200 bg-white p-2 min-h-[36rem] "
      x-show="asideOpen">

      <Link href={'/usuarios'}>
        <a
          className={`
          flex items-center space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600
          ${searchPath('usuarios') ? 'text-blue-500 font-bold' : ''}`
          }
        >
          <div className='mr-3 text-slate-600 text-xl'><FaUserTie /></div>
          {' '}
          Usuarios
          {' '}
        </a>
      </Link>

      <Link href='/subs'>
        <a
          className={`
          flex items-center space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600
           ${searchPath('subs') ? 'text-blue-500 font-bold' : ''}`
          }
        >
          <div className='mr-3 text-slate-600 text-xl'><BsFillPersonCheckFill /></div>
          {' '}
          Subscriciones{' '}
        </a>
      </Link>

      <Link href='/motorizados'>
        <a
          className={`
            flex items-center space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600
            ${searchPath('motorizados') ? 'text-blue-500 font-bold' : ''}`
          }
        >
          <div className='mr-3 text-slate-600 text-xl'><FaMotorcycle /></div>
          {' '}
          Motorizados{' '}
        </a>
      </Link>

      <Link href='/agencias'>
        <a
          className={`
          flex items-center space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600
           ${searchPath('agencias') ? 'text-blue-500 font-bold' : ''}`
          }
        >
          <div className='mr-3 text-slate-600 text-xl'><ImOffice /></div>
          {' '}
          Agencias{' '}
        </a>
      </Link>

      <Link href='/empresas'>
        <a
          className={`
            flex items-center space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600
            ${searchPath('empresas') ? 'text-blue-500 font-bold' : ''}`
          }

        >
          <div className='mr-3 text-slate-600 text-xl'><HiOfficeBuilding /></div>
          {' '}
          Empresas{' '}
        </a>
      </Link>

      <Link href='/sectores-economicos'>
        <a
          className={`
            flex items-center space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600
            ${searchPath('empresas') ? 'text-blue-500 font-bold' : ''}`
          }

        >
          <div className='mr-3 text-slate-600 text-[1.1rem]'><FaStore /></div>
          {' '}
          Sectores Economicos{' '}
        </a>
      </Link>

      <Link href='/categorias_principales'>
        <a
          className={`
            flex items-center space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600
            ${searchPath('empresas') ? 'text-blue-500 font-bold' : ''}`
          }

        >
          <div className='mr-3 text-slate-600 text-[1.1rem]'><FaStore /></div>
          {' '}
          Categorias Principales {' '}
        </a>
      </Link>

      <Link href='/secciones'>
        <a
          className={`
            flex items-center space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600
            ${searchPath('empresas') ? 'text-blue-500 font-bold' : ''}`
          }

        >
          <div className='mr-3 text-slate-600 text-[1.1rem]'><AiFillHome /></div>
          {' '}
          Secciones {' '}
        </a>
      </Link>

      <Link href='/lp'>
        <a
          className={`
            flex items-center space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600
            ${searchPath('empresas') ? 'text-blue-500 font-bold' : ''}`
          }

        >
          <div className='mr-3 text-slate-600 text-[1.1rem]'><FaPager /></div>
          {' '}
          Landing Page{' '}
        </a>
      </Link>
    </aside>

  );

};
