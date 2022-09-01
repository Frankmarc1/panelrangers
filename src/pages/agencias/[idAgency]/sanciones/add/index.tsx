import { Dashboard } from "../../../../../layout/Dashboard/Dashboard";
import styles from "./../../../../../../styles/index.module.css";
const SancionesAdd = () => {
    return (
        <Dashboard>
            <div className="card bg-white pb-3  border">
                <div className="card-header border-b ">
                    <h3 className="ml-[2rem] font-bold my-2 card-title">Agregar recompensa o sanción</h3>
                </div>
                <div className={`card-body overflow-scroll max-h-[31.2rem] ${styles.scroll}`}>
                    <form>
                        <div className="container mx-auto grid grid-cols-2 gap-4">
                            <div className='mb-5 grid grid-cols-1'>
                                <label htmlFor='tit' className=' font-semibold'>
                                    Titulo
                                </label>
                                <input
                                    type='text'
                                    id='tit'
                                    className='w-full h-[2rem] mt-[-2.4rem] rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                                />
                            </div>

                            <div className="container mx-auto grid grid-cols-1 mb-4">
                                <div className="flex justify-center">
                                    <div className="mb-3 xl:w-full">
                                        <label htmlFor="det" className=" font-semibold form-label inline-block mb-2 text-gray-700">Detalles</label>
                                        <textarea
                                            className="form-control block w-full px-3 py-1.5 text-base font-normal  text-gray-700  bg-white bg-clip-padding border border-solid border-gray-300  rounded  transition  ease-in-out  m-0  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            id="det"
                                            rows={3}
                                            placeholder="Your message"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="container mx-auto grid grid-cols-1 mb-4">
                                <div className="flex justify-center">
                                    <div className="mb-3 xl:w-full">
                                        <label htmlFor="det_esp" className=" font-semibold form-label inline-block mb-2 text-gray-700">Detalles Especificos</label>
                                        <textarea
                                            className="form-control block w-full px-3 py-1.5 text-base font-normal  text-gray-700  bg-white bg-clip-padding border border-solid border-gray-300  rounded  transition  ease-in-out  m-0  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            id="det_esp"
                                            rows={3}
                                            placeholder="Your message"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className='mb-4 grid grid-cols-1'>
                                <label htmlFor='pun' className=' font-semibold'>
                                    Puntos
                                </label>
                                <input
                                    type='number'
                                    id='pun'
                                    className='w-full h-[2rem] mt-[-2.4rem] rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                                />
                            </div>

                            <div className='mb-4 grid grid-cols-1'>
                                <label htmlFor='tip' className='block mb-2 text-sm font-semibold'>
                                    Tipo 
                                </label>
                                <select
                                    id='tip'
                                    className='border py-1 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                >
                                    <option selected>Seleccionar</option>
                                    <option value='US'>Pendientes</option>
                                    <option value='CA'>Copletados</option>
                                </select>
                            </div>

                            <div className='mb-4 grid grid-cols-1'>
                                <label htmlFor='fec_ini' className=' mb-[3rem] font-semibold'>
                                    Fecha De Inicio
                                </label>
                                <input
                                    type='date'
                                    id='fec_ini'
                                    className='w-full h-[2rem] mt-[-2.4rem] rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                                />
                            </div>

                            <div className='mb-4 grid grid-cols-1'>
                                <label htmlFor='fec_fin' className=' mb-[3rem] font-semibold'>
                                    Fecha De Fin
                                </label>
                                <input
                                    type='date'
                                    id='fec_fin'
                                    className='w-full h-[2rem] mt-[-2.4rem] rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                                />
                            </div>

                        </div>
                        <button type="button" className="btn btn-primary btn-md w-full">Guardar Medalla</button>
                    </form>
                </div>
            </div>
        </Dashboard>

    );
}
export default SancionesAdd;