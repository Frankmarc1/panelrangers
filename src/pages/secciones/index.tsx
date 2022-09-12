import { FaPencilAlt } from "react-icons/fa";
import { Dashboard } from "../../layout/Dashboard/Dashboard";
const Secciones = () => {
    return (
        <Dashboard>
            <div className="flex justify-center">
                <div className="block rounded-lg shadow-lg bg-white  w-3/4 text-center">
                    <div className="p-6 flex flex-start">
                        <div className="block">
                            <h3 className="flex flex-start">DElivu free</h3>
                            <p className="flex flex-start">hoa eu</p>

                            <div className="card w-96 bg-base-100 shadow-sm border border-slate-300">
                                <div className="card-body">
                                    <h2 className="card-title">Card title!</h2>

                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="py-3 px-6 border-t border-gray-300 text-gray-600">
                        <div className="flex">
                            <button
                                type="button"
                                className="inline-block px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-slate-500 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mr-3">
                                <div className="flex">
                                    <p className="mr-1 text-[0.9rem] mt-1"><FaPencilAlt /></p>
                                    <p className="font-medium text-[1rem]">Editar</p>
                                </div>
                            </button>
                            <div className="form-control flex justify-end">
                                <input type="checkbox" className="toggle toggle-primary h-[1.2rem] flex mb-2" checked />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Dashboard>

    );
}
export default Secciones;