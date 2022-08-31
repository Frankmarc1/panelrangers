import { Dashboard } from "../../../../../layout/Dashboard/Dashboard";
const RankingsAdd = () => {
    return (
        <Dashboard>
            <div className="card bg-white pb-2  border">
                <div className="card-header border-b ">
                    <h3 className="ml-[2rem] font-bold my-2 card-title">Agregar Rankings</h3>
                </div>
                <div className="card-body">
                    <form>
                        <div className="container mx-auto grid grid-cols-1">
                            <div className='mb-5 grid grid-cols-1'>
                                <label htmlFor='name' className='mb-2 font-semibold'>
                                    Nombre
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    className='w-full  rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                                />
                            </div>

                            <div className=" grid  grid-cols-2 gap-4">
                                <div className='mb-5 grid grid-cols-1'>
                                    <label htmlFor='pun' className='mb-2 font-semibold'>
                                        Puntos
                                    </label>
                                    <input
                                        type='number'
                                        id='pun'
                                        className='w-full  rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                                    />
                                </div>

                                <div className='mb-5 grid grid-cols-1'>
                                    <label htmlFor='est' className='mb-2 font-semibold'>
                                        Estrellas
                                    </label>
                                    <input
                                        type='number'
                                        id='est'
                                        className='w-full  rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                                    />
                                </div>

                                <div className='mb-5 grid grid-cols-1'>
                                    <label htmlFor='por' className='mb-2 font-semibold'>
                                        Porcentaje
                                    </label>
                                    <input
                                        type='number'
                                        id='por'
                                        className='w-full  rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                                    />
                                </div>

                                <div className='mb-5 grid grid-cols-1'>
                                    <label htmlFor='var' className='mb-2 font-semibold'>
                                        Variaccion
                                    </label>
                                    <input
                                        type='number'
                                        id='var'
                                        className='w-full  rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                                    />
                                </div>
                            </div>
                            <div className='mb-5 grid grid-cols-1'>
                                <label className='block mb-1 text-sm font-bold' htmlFor='img'>
                                    Imagen
                                </label>
                                <input
                                    className='text-wrap  w-full text-md  text-gray-800 bg-gray-50 rounded-lg border  border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none  dark:border-gray-600 dark:placeholder-gray-400'
                                    id='img'
                                    type='file'
                                />
                            </div>
                        </div>
                        <button type="button" className=" w-full btn btn-primary btn-md">Guardar Rango</button>
                    </form>
                </div>
            </div>
        </Dashboard>

    );
}
export default RankingsAdd;