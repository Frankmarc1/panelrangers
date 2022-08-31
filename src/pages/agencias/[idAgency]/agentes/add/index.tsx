import { Dashboard } from "../../../../../layout/Dashboard/Dashboard";
const AgentAdd = () => {
    return (
        <Dashboard>
            <div className="card bg-white pb-5  border">
                <div className=" card-header border-b boder-slate-500  ">
                    <h2 className="ml-[2rem]  card-title my-2">Crear Agente</h2>
                </div>
                <div className="card-body">
                    <form>
                        <div className="container mx-auto grid grid-cols-1">
                        <div className='mb-5 grid grid-cols-1'>
                                <label htmlFor='name' className='mb-2 font-semibold'>
                                    Nombres de agente
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    className='w-full  rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                                />
                            </div>
                            <div className='mb-5 grid grid-cols-1'>
                                <label htmlFor='dir' className='mb-2 font-semibold'>
                                    Direccion
                                </label>
                                <input
                                    type='text'
                                    id='dir'
                                    className='w-full  rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                                />
                            </div>
                            <div className='mb-5 grid grid-cols-1'>
                                <label className='block mb-1 text-sm font-bold ' htmlFor='add_fot'>
                                    Actualizar foto
                                </label>
                                <input
                                    className='text-wrap  w-full text-md  text-gray-900 bg-gray-50 rounded-lg  border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none  dark:border-gray-600 dark:placeholder-gray-400'
                                    id='add_fot'
                                    type='file'
                                />
                            </div>
                        </div>
                        <button type="button" className=" w-full btn btn-primary btn-md">Guardar Agente</button>
                    </form>
                </div>
            </div>
        </Dashboard>

    );
}
export default AgentAdd;