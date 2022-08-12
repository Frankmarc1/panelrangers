import { FaPen } from "react-icons/fa";
import { MdOutlineRefresh } from "react-icons/md";

const DataTable = () => {
  return (
    <section>
      <div className='overflow-x-auto container m-auto mt-5'>
        <table className='table w-full border'>
          <thead className='border'>
            <tr className='border'>
              <th>D.N.I</th>
              <th>Nombres y Apellidos</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='border'>10101010</td>
              <td className='border'>Maria de los Palotes</td>
              <td className='grid grid-cols-2 gap-2'>
                <div>Admin</div>

                <div className=' grid place-content-end text-cyan-600 text-xl'>
                  <FaPen />
                </div>
              </td>

              <td className='border h-full py-0'>
                <div className=' rounded-md bg-amber-500 text-2xl w-8 '>
                  <div className='py-1 px-1'>
                    <MdOutlineRefresh />
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td className='border'>20202020</td>
              <td className='border'>quien sabe </td>
              <td className='grid grid-cols-2 gap-2'>
                <div>Admin</div>

                <div className=' grid place-content-end text-cyan-600 text-xl'>
                  <FaPen />
                </div>
              </td>
              <td className='border h-full py-0'>
                <div className=' rounded-md bg-amber-500 text-2xl w-8 '>
                  <div className='py-1 px-1'>
                    <MdOutlineRefresh />
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td className='border'>30303030</td>
              <td className='border'>No me acuerdo</td>
              <td className='grid grid-cols-2 gap-2'>
                <div>Admin</div>

                <div className=' grid place-content-end text-cyan-600 text-xl'>
                  <FaPen />
                </div>
              </td>
              <td className='border h-full py-0'>
                <div className=' rounded-md bg-amber-500 text-2xl w-8 '>
                  <div className='py-1 px-1'>
                    <MdOutlineRefresh />
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td className='border'>40404040</td>
              <td className='border'>Pedro Armando Paredes</td>
              <td className='grid grid-cols-2 gap-2'>
                <div>Admin</div>

                <div className=' grid place-content-end text-cyan-600 text-xl'>
                  <FaPen />
                </div>
              </td>
              <td className='border h-full py-0'>
                <div className=' rounded-md bg-amber-500 text-2xl w-8 '>
                  <div className='py-1 px-1'>
                    <MdOutlineRefresh />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div className='mt-3 w-full grid sm:grid-cols-1 xl:grid-cols-2'>
          <div className='grid cols-1'></div>

          <div className='grid grid-cols-1'>
            <div className='grid grid-cols-3 justify-self-end'>
              <div>
                <div className='flex'>
                  <div className='mt-[0.7rem]'>
                    <p>Numero de filas</p>
                  </div>
                  <div className='pl-2'>
                    <button className='btn bg-white border-blue-200 text-slate-500 font-bold hover:bg-blue-500 hover:border-white'>
                      25
                    </button>
                  </div>
                </div>
              </div>

              <div className='grid place-content-center'>1-2 de 2</div>
              <div className='btn-group'>
                <button className='btn bg-white border-blue-200 text-slate-900 font-bold hover:bg-blue-500 hover:border-white'>
                  «
                </button>
                <button className='btn bg-white border-blue-200 text-slate-900 font-bold hover:bg-blue-500 hover:border-white'>
                  Page 22
                </button>
                <button className='btn bg-white border-blue-200 text-slate-900 font-bold hover:bg-blue-500 hover:border-white'>
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default DataTable;
