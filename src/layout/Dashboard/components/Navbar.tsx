import Link from 'next/link';
import React from 'react';
import { FaUserTie,FaMotorcycle } from "react-icons/fa";
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
          <div className='mr-3 text-slate-600 text-xl'><FaUserTie/></div>
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
          <div className='mr-3 text-slate-600 text-xl'><BsFillPersonCheckFill/></div>
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


    </aside>

  );

  /*return (
    <nav className='navbar bg-base-100 w-full'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <label tabIndex={0} className=' btn btn-ghost btn-circle'>
            <FaBars />
          </label>
          <ul
            tabIndex={0}
            className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52'
          >
            <li>
              <Link href={'/usuarios'}>
                <a
                  className={
                    searchPath('usuarios') ? 'text-blue-500 font-bold' : ''
                  }
                >
                  {' '}
                  Usuarios{' '}
                </a>
              </Link>
            </li>

            <li>
              <Link href='/subs'>
                <a
                  className={
                    searchPath('subs') ? 'text-blue-500 font-bold' : ''
                  }
                >
                  {' '}
                  Subscriciones{' '}
                </a>
              </Link>
            </li>

            <li>
              <Link href='/motorizados'>
                <a
                  className={
                    searchPath('motorizados') ? 'text-blue-500 font-bold' : ''
                  }
                >
                  {' '}
                  Motorizados{' '}
                </a>
              </Link>
            </li>

            <li>
              <Link href='/agencias'>
                <a
                  className={
                    searchPath('agencias') ? 'text-blue-500 font-bold' : ''
                  }
                >
                  {' '}
                  Agencias{' '}
                </a>
              </Link>
            </li>
            <li>
              <Link href='/empresas'>
                <a
                  className={
                    searchPath('empresas') ? 'text-blue-500 font-bold' : ''
                  }
                >
                  {' '}
                  Empresas{' '}
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className='navbar-center'>
        <Link href={'/dashboard'}>
          <a className='btn btn-ghost normal-case text-xl'>Rangers Dashboard</a>
        </Link>
      </div>

      <div className='navbar-end'>
        <div className='dropdown dropdown-end'>
          <label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
            <div className='w-10 rounded-full'>
              <img src='/Usuario.png' />
            </div>
          </label>
          <ul
            tabIndex={0}
            className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52'
          >
            <li>
              <a>Cerrar sesion</a>
            </li>
          </ul>
        </div>
      </div>
       </nav>
                
                
              
  );*/
};
