import Link from "next/link";
const HeaderNav=()=>{
    return (
        <>
        <div className='navbar-center'>
          <Link href={'/'}>
            <a className='btn btn-ghost normal-case text-xl'>Rangers Dashboard</a>
          </Link>
        </div>

        <div>
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
        </div>
        </>
      
    )
}
export default HeaderNav;