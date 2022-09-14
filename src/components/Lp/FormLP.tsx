const FormLP = () => {
    return (
        <section className="flex justify-center">
            <div className="card border rounded rounded-md w-4/5">
                <div className="card-header border-b py-2 flex justify-center">
                    <h3 className="card-title font-medium">Crear servicios</h3>
                </div>
                <div className="card-body ">
                    <form>
                        <div className='mb-5'>
                            <label className='block mb-1 text-md font-medium  ' htmlFor='add_fot'>
                                Imagen
                            </label>
                            <input
                                className='text-wrap  w-full text-md  text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none  dark:border-gray-600 dark:placeholder-gray-400'
                                id='add_fot'
                                type='file'
                            />
                        </div>
                        <div className='mb-5 '>
                            <label htmlFor='name' className='mb-2 font-semibold'>
                                Nombre
                            </label>
                            <input
                                type='text'
                                id='name'
                                placeholder="Nombres ...!"
                                className='w-full  rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="des" className=" font-semibold form-label inline-block mb-2 text-gray-700">Descripcion</label>
                            <textarea
                                className="form-control block w-full px-3 py-1.5 text-base font-normal  text-gray-700  bg-white bg-clip-padding border border-solid border-gray-300  rounded  transition  ease-in-out  m-0  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="des"
                                rows={2}
                                placeholder="Your message"
                            ></textarea>
                        </div>
                        <div className="flex justify-center ">
                            <button
                                type="button"
                                className=" flex justify-center mt-3 ml-1 inline-block px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-tight  rounded shadow-md hover:bg-slate-500 hover:shadow-lg focus:bg-blue-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mr-3">
                                <p className="font-medium text-[1rem]">Registrar</p>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
export default FormLP;