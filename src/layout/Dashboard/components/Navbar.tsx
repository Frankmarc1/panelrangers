import Link from 'next/link';
import { FaBars, FaList } from 'react-icons/fa';

import { useRouteMatch } from '../../../hooks/useRouteMatch';

export const Navbar = () => {
  const searchPath = useRouteMatch();

  return (
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
              <Link href={'/dashboard/usuarios'}>
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
              <Link href='/dashboard/motorizados'>
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
              <Link href='/dashboard/agencias'>
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
  );
};
