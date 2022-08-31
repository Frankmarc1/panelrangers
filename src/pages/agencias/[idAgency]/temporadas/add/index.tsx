import { Dashboard } from "../../../../../layout/Dashboard/Dashboard";
const SeaccionsAdd = () => {
    return (
        <Dashboard>
            <div className="card bg-white pb-2  border">
                <div className="card-header border-b ">
                    <h3 className="ml-[2rem] font-bold my-2 card-title">Agregar Temporada</h3>
                </div>
                <div className="card-body">
                    <form>
                        <div className="grid grid-cols-3 gap-4 ">
                            <div className=" grid col-span-2 ">
                                
                                <div className="w-full ">
                                    <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                        <div className=" flex flex-col justify-center items-center pt-5 pb-6">
                                            <p className="text-md text-gray-500 dark:text-gray-400 card-title">Agregar Banner</p>
                                        </div>
                                        <input id="dropzone-file" type="file" className="hidden" />
                                    </label>
                                </div>
                               
                            </div>
                            <div className="grid grid-cols-1">
                                <div className=" w-full">
                                    <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                        <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                            <p className="text-md text-gray-500 dark:text-gray-400 card-title">Agregar Banner</p>
                                        </div>
                                        <input id="dropzone-file" type="file" className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div className='mb-5 grid col-span-2 h-[2rem]'>
                                <label htmlFor='name' className='mb-2 font-semibold'>
                                    Nombre
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    className='w-full rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                                />
                            </div>

                            <div className="container mx-auto grid grid-cols-1">
                                <div className="flex justify-center items-center w-full">
                                    <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                        <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                            <p className="text-md text-gray-500 dark:text-gray-400 card-title">Agregar Banner</p>
                                        </div>
                                        <input id="dropzone-file" type="file" className="hidden" />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <button type="button" className=" w-full btn btn-primary btn-md">Guardar Temporada</button>
                    </form>
                </div>
            </div>
        </Dashboard>

    );
}
export default SeaccionsAdd;