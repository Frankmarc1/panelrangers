import { IoMdAddCircle } from "react-icons/io";
import { Dashboard } from "../../layout/Dashboard/Dashboard"
export const FormMainCategorys = () => {
    return (
        <Dashboard>
            <div className="card border border-slate-300 bg-slate-50 rounded ">
                <div className="card-header flex justify-center border-b py-2">
                    <h3 className="card-title font-medium"> Agregar Categoria</h3>
                </div>
                <div className="card-body">
                    <form>
                        <div className="flex justify-center items-center w-full mb-4    ">
                            <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-full h-[4rem] bg-white rounded-lg border border-gray-400  cursor-pointer dark:hover:bg-bray-100 dark:bg-gray-100 hover:bg-gray-100 dark:border-gray-200 dark:hover:border-gray-50 dark:hover:bg-gray-300">
                                <div className="flex  justify-center items-center pt-5 pb-6 font-medium">
                                    <p className="font-semibold mt-1 mr-2 text-xl"><IoMdAddCircle /></p> Agregar Imagen
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" />
                            </label>
                        </div>
                        <div className='mb-5 '>
                            <input
                                type='text'
                                id='name'
                                placeholder="Name... !"
                                className='w-full  rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                            />
                        </div>

                    </form>
                </div>

            </div>
        </Dashboard>
    );
}