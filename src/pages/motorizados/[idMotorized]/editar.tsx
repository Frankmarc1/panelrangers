import React from 'react';
import { Dashboard } from '../../../layout/Dashboard/Dashboard';
const editar = () => {
  return (
    <Dashboard>
      <section className='container m-auto'>
        <div className='card bg-base-100 shadow-xl pt-[1rem]'>
          <div className='card-header border-b'>
            <h3 className='text-lg font-md font-medium flex place-content-center mt-[-0.5rem]'>
              Editar Motorizado
            </h3>
          </div>

          <h2 className=' ml-[2rem] text-lg font-medium'>Datos del Rangers</h2>
          <div className='card-body mt-[-0.6rem]'>
            <form>
              <div className='grid grid-cols-4 gap-4'>
                <div className='mb-4 grid grid-cols-1'>
                  <label htmlFor='dni' className='mb-2 font-semibold'>
                    D.N.I
                  </label>
                  <input
                    type='text'
                    id='dni'
                    className='w-full max-w-lg rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                  />
                </div>

                <div className='mb-4 grid grid-cols-1'>
                  <label htmlFor='name' className='mb-2 font-semibold'>
                    Nombre(s)
                  </label>
                  <input
                    type='text'
                    id='name'
                    className='w-full max-w-lg rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                  />
                </div>
                <div className='mb-4 grid grid-cols-1'>
                  <label htmlFor='surnames' className='mb-2 font-semibold'>
                    Apellidos
                  </label>
                  <input
                    type='text'
                    id='surnames'
                    className='w-full max-w-lg rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                  />
                </div>
                <div className='mb-4 grid grid-cols-1'>
                  <label htmlFor='phone' className='mb-2 font-semibold'>
                    Teléfono
                  </label>
                  <input
                    type='text'
                    id='phone'
                    className='w-full max-w-lg rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                  />
                </div>
                <div className='mb-4 grid grid-cols-1'>
                  <label htmlFor='datos_app' className='block mb-2 text-sm'>
                    Datos en la App
                  </label>
                  <select
                    id='datos_app'
                    className='border py-1 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  >
                    <option selected>Seleccionar</option>
                    <option value='US'>Pendientes</option>
                    <option value='CA'>Copletados</option>
                  </select>
                </div>

                <div className='mb-4 grid grid-cols-1'>
                  <label htmlFor='fases' className='block mb-2 text-sm'>
                    Fases
                  </label>
                  <select
                    id='fases'
                    className='border py-1 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  >
                    <option selected>Seleccionar</option>
                    <option value='US'>Pendientes</option>
                    <option value='CA'>Copletados</option>
                  </select>
                </div>
                <div className='mb-4 grid grid-cols-1'>
                  <label htmlFor='agencia' className='block mb-2 text-sm'>
                    Agencia
                  </label>
                  <select
                    id='agencia'
                    className='border py-1 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  >
                    <option selected>Seleccionar</option>
                    <option value='US'>Pendientes</option>
                    <option value='CA'>Copletados</option>
                  </select>
                </div>
                <div className='mb-4 grid grid-cols-1'>
                  <label htmlFor='por_rep' className='mb-2 font-semibold'>
                    Porcentaje por reporte
                  </label>
                  <input
                    type='text'
                    id='por_rep'
                    className='w-full max-w-lg rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                  />
                </div>

                <div className='mb-4 grid grid-cols-1'>
                  <label htmlFor='tip_rag' className='block mb-2 text-sm '>
                    Tipo de Rangers
                  </label>
                  <select
                    id='tip_rag'
                    className='border py-1 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  >
                    <option selected>Seleccionar</option>
                    <option value='US'>Pendientes</option>
                    <option value='CA'>Copletados</option>
                  </select>
                </div>
                <div className='mb-4 grid grid-cols-1'>
                  <label className='block mb-1 text-sm' htmlFor='act_fot'>
                    Actualizar foto
                  </label>
                  <input
                    className='text-wrap block w-full text-md  text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none  dark:border-gray-600 dark:placeholder-gray-400'
                    id='act_fot'
                    type='file'
                  />
                </div>
              </div>
              <h2 className=' ml-[.1rem] mt-4 mb-2 text-lg font-medium'>
                Datos de su movilidad
              </h2>

              <div className='grid grid-cols-2 gap-5'>
                <div className='mb-4 grid grid-cols-1'>
                  <label htmlFor='fec_vbre' className='mb-2 font-semibold'>
                    Fecha de vencimiento del brevete
                  </label>
                  <input
                    type='date'
                    id='fec_vbre'
                    className='w-full max-w-lg rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                  />
                </div>
                <div className='mb-4 grid grid-cols-1'>
                  <label htmlFor='fec_vbre' className='mb-2 font-semibold'>
                    Fecha de vencimiento del brevete
                  </label>
                  <input
                    type='date'
                    id='fec_vbre'
                    className='w-full max-w-lg rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                  />
                </div>
              </div>

              <div className='grid grid-cols-4 gap-5'>
                <div className='mb-4 grid grid-cols-1'>
                  <label htmlFor='marca' className='mb-2 font-semibold'>
                    Marca
                  </label>
                  <input
                    type='text'
                    id='marca'
                    className='w-full max-w-lg rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                  />
                </div>
                <div className='mb-4 grid grid-cols-1'>
                  <label htmlFor='placa' className='mb-2 font-semibold'>
                    Placa
                  </label>
                  <input
                    type='text'
                    id='placa'
                    className='w-full max-w-lg rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                  />
                </div>
                <div className='mb-4 grid grid-cols-1'>
                  <label htmlFor='color' className='mb-2 font-semibold'>
                    color
                  </label>
                  <input
                    type='text'
                    id='color'
                    className='w-full max-w-lg rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                  />
                </div>
                <div className='mb-4 grid grid-cols-1'>
                  <label htmlFor='tipo' className='block mb-2 text-sm '>
                    Tipo
                  </label>
                  <select
                    id='tipo'
                    className='border py-1 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  >
                    <option selected>Seleccionar</option>
                    <option value='US'>Auto</option>
                    <option value='CA'>Motocicleta</option>
                    <option value='CA'>Mototaxi</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
          <div className='card-footer text-muted border-t '>
            <button
              type='button'
              className='text-gray-900 ml-[2rem] my-[1rem] bg-blue-400 border border-gray-300 focus:outline-none  hover:bg-blue-600 hover:text-white  focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
            >
              Actualizar Motorizado
            </button>
          </div>
        </div>
      </section>
    </Dashboard>
  );
};
export default editar;
