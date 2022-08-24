import { Dashboard } from "../../../../layout/Dashboard/Dashboard";
const editar = () => {
    return (
        <Dashboard>
            <section className="container m-auto">
                <div className="card bg-base-100 shadow-xl pt-[1rem]">
                    <div className="card-header border-b">
                        <h3 className="text-lg font-md font-medium flex place-content-center mt-[-0.5rem]">Editar Motorizado</h3>
                    </div>

                    <h2 className=" ml-[2rem] text-lg font-medium">Datos del Rangers</h2>
                    <div className="card-body mt-[-0.6rem]">
                        <form>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="mb-4 grid grid-cols-1">
                                    <label htmlFor="dni" className="block mb-2 ">D.N.I</label>
                                    <input type="text" id="dni" className="block p-2  rounded rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-200 border border-gray-400 " />

                                </div>
                                <div className="mb-4 grid grid-cols-1">
                                    <label htmlFor="name" className="block mb-2 ">Nombre(s)</label>
                                    <input type="text" id="name" className="p-2 border  rounded rounded-md dark:bg-gray-200 border border-gray-400 focus:ring-blue-500 focus:border-blue-500 " />
                                </div>
                                <div className="mb-4 grid grid-cols-1">
                                    <label htmlFor="surnames" className="block mb-2">Apellidos</label>
                                    <input type="text" id="surnames" className="block p-2 border  rounded rounded-md dark:bg-gray-200 border border-gray-400 focus:ring-blue-500 focus:border-blue-500 " />
                                </div>
                                <div className="mb-4 grid grid-cols-1">
                                    <label htmlFor="phone" className="block mb-2">Teléfono</label>
                                    <input type="text" id="phone" className="block p-2 bborder  rounded rounded-md dark:bg-gray-200 border border-gray-400 focus:ring-blue-500 focus:border-blue-500 " />
                                </div>
                                <div className="mb-4 grid grid-cols-1">
                                    <label htmlFor="datos_app" className="block mb-2 text-sm">Datos en la App</label>
                                    <select id="datos_app" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option selected>Seleccionar</option>
                                        <option value="US">Pendientes</option>
                                        <option value="CA">Copletados</option>
                                    </select>
                                </div>

                                <div className="mb-4 grid grid-cols-1">
                                    <label htmlFor="fases" className="block mb-2 text-sm">Fases</label>
                                    <select id="fases" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option selected>Seleccionar</option>
                                        <option value="US">Pendientes</option>
                                        <option value="CA">Copletados</option>

                                    </select>
                                </div>
                                <div className="mb-4 grid grid-cols-1">
                                    <label htmlFor="agencia" className="block mb-2 text-sm">Agencia</label>
                                    <select id="agencia" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option selected>Seleccionar</option>
                                        <option value="US">Pendientes</option>
                                        <option value="CA">Copletados</option>

                                    </select>
                                </div>
                                <div className="mb-4 grid grid-cols-1">
                                    <label htmlFor="por_rep" className="block mb-2 text-sm">Porcentaje por reporte</label>
                                    <input type="text" id="por_rep" className="block p-2 border rounded rounded-md dark:bg-gray-200 dark:bg-gray-200  border-gray-400" />
                                </div>


                                <div className="mb-4 grid grid-cols-1">
                                    <label htmlFor="tip_rag" className="block mb-2 text-sm ">Tipo de Rangers</label>
                                    <select id="tip_rag" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option selected>Seleccionar</option>
                                        <option value="US">Pendientes</option>
                                        <option value="CA">Copletados</option>
                                    </select>
                                </div>
                                <div className="mb-4 grid grid-cols-1">
                                    <label className="block mb-2 text-sm" htmlFor="act_fot">Actualizar foto</label>
                                    <input className="text-wrap block w-full text-sm h-[2.7rem] text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none  dark:border-gray-600 dark:placeholder-gray-400" id="act_fot" type="file" />
                                </div>
                            </div>
                            <h2 className=" ml-[.1rem] mt-4 mb-2 text-lg font-medium">Datos de su movilidad</h2>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="mb-4 grid grid-cols-1">
                                    <label htmlFor="fec_vbre" className="block mb-2 ">Fecha de vencimiento del brevete</label>
                                    <input type="date" id="fec_vbre" className="block p-2  rounded rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-200 border border-gray-400 " />

                                </div>
                                <div className="mb-4 grid grid-cols-1">
                                    <label htmlFor="fec_vbre" className="block mb-2 ">Fecha de vencimiento del brevete</label>
                                    <input type="date" id="fec_vbre" className="p-2 border  rounded rounded-md dark:bg-gray-200 border border-gray-400 focus:ring-blue-500 focus:border-blue-500 " />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-5">
                                <div className="mb-4 grid grid-cols-1">
                                    <label htmlFor="marca" className="block mb-2 ">Marca</label>
                                    <input type="date" id="marca" className="block p-2  rounded rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-200 border border-gray-400 " />

                                </div>
                                <div className="mb-4 grid grid-cols-1">
                                    <label htmlFor="placa" className="block mb-2 ">Placa</label>
                                    <input type="date" id="placa" className="p-2 border  rounded rounded-md dark:bg-gray-200 border border-gray-400 focus:ring-blue-500 focus:border-blue-500 " />
                                </div>
                                <div className="mb-4 grid grid-cols-1">
                                    <label htmlFor="color" className="block mb-2 ">Color</label>
                                    <input type="date" id="color" className="block p-2  rounded rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-200 border border-gray-400 " />

                                </div>
                                <div className="mb-4 grid grid-cols-1">
                                    <label htmlFor="tipo" className="block mb-2 text-sm">Tipo</label>
                                    <select id="tipo" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option selected>Seleccionar</option>
                                        <option value="US">Auto</option>
                                        <option value="CA">Motocicleta</option>
                                        <option value="CA">Mototaxi</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="card-footer text-muted border-t ">
                        <button type="button" className="text-gray-900 ml-[2rem] my-[1rem] bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Actualizar Motorizado</button>
                    </div>
                    
                </div>
            </section>
        </Dashboard>
    );
}
export default editar;