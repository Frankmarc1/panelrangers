import { faBars, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { useRouteMatch } from '../../../hooks/useRouteMatch';

import {Sidebar} from './Sidebar';
import { useMediaQuery } from 'react-responsive';
import { useFavicon } from '../../../hooks/useFavicon';

export  const Navbar = () => {

  const searchPath = useRouteMatch();
  const isMovil = useMediaQuery({ maxWidth: '596px' });
  const icon= useFavicon();
  return (
    <nav className='navbar bg-base-100 w-full'>
     
        <div className='navbar-start pl-[1rem]'>
          <div className='dropdown'>
            <label tabIndex={0} className='w-[1.8rem] btn btn-ghost btn-circle'>
              <FontAwesomeIcon icon={faBars}/>
            </label>
            <ul
              tabIndex={0}
              className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52'
            >
              <li>
                <Link href='/dashboard/estadisticas'>
                  <a
                    className={
                      searchPath('estadisticas') ? 'text-blue-500 font-bold' : ''
                    }
                  >
                    {' '}
                    Estadisticas{' '}
                  </a>
                </Link>
                <Link href={`/dashboard/usuarios`}>
                  <a
                    className={
                      searchPath('usuarios')
                        ? 'text-blue-500 font-bold'
                        : ''
                    }
                  >
                    {' '}
                    Usuarios{' '}
                  </a>
                </Link>
              </li>
            
                <li>
                  <Link href='/dashboard/repartidores'>
                    <a
                      className={
                        searchPath('repartidores') ? 'text-blue-500 font-bold' : ''
                      }
                    >
                      {' '}
                      Repartidores{' '}
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

        <div className='navbar-end pr-[1rem]'>
          {
            (!isMovil ? (
              <ul className='flex w-2/6 justify-end'>
                <Sidebar />
              </ul>
            ) : (
              <div className='dropdown dropdown-end'>
                <label tabIndex={0} className='btn btn-ghost btn-circle'>
                  <FontAwesomeIcon icon={faList} />
                </label>
                <ul
                  tabIndex={0}
                  className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52'
                >
                  <Sidebar />
                </ul>
              </div>
            ))}
          <div className='dropdown dropdown-end'>
            <label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
              <div className='w-10 rounded-full'>
                <img src={icon}  />
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
