import { Dashboard } from "../../../../../layout/Dashboard/Dashboard";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { TiDelete } from "react-icons/ti";
import { RiAddLine } from "react-icons/ri";
import styles from "./../../../../../components/FirebaseDataTable/styles/index.module.css";
const SeaccionsAdd = () => {

    return (
        <Dashboard>
            <div className="card bg-white pb-2  border">
                <div className="card-header border-b ">
                    <h3 className="ml-[2rem] font-bold my-2 card-title">Agregar Temporada</h3>
                </div>
                <div className={`card-body overflow-auto max-h-[32rem] ${styles.scroll}`}>
                    <form>
                        <div className="grid grid-cols-3 gap-4 mb-4 ">
                            <div className=" grid col-span-2 ">

                                <div className="w-full  mb-4">
                                    <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-full h-[9rem] bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                        <div className=" flex flex-col justify-center items-center pt-5 pb-6">
                                            <p className="text-md text-gray-500 dark:text-gray-400 card-title">Agregar Banner</p>
                                        </div>
                                        <input id="dropzone-file" type="file" className="hidden" />
                                    </label>
                                </div>

                            </div>
                            <div className="grid grid-cols-1">
                                <div className=" w-full">
                                    <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-full h-[9rem] bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                        <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                            <p className="text-md text-gray-500 dark:text-gray-400 card-title">Agregar Imagen Top</p>
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

                            <div className="container mx-auto grid grid-cols-1 mb-4">
                                <div className="flex justify-center">
                                    <div className="mb-3 xl:w-full">
                                        <label htmlFor="exampleFormControlTextarea1" className="form-label inline-block mb-2 text-gray-700">detalles de la Temporada</label>
                                        <textarea
                                            className="form-control block w-full px-3 py-1.5 text-base font-normal  text-gray-700  bg-white bg-clip-padding border border-solid border-gray-300  rounded  transition  ease-in-out  m-0  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            id="exampleFormControlTextarea1"
                                            rows={5}
                                            placeholder="Your message"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-4">
                            <div className="container mx-auto grid col-span-3">
                                <div className='mb-5 grid col-span-2 h-[2rem]'>
                                    <h4 className="card-title">Listado de Musica</h4>
                                    <button type="button" className="flex justify-self-center"><span className="text-primary text-[24px]"><RiAddLine /></span><span className="text-primary">Agregar Musica</span></button>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="mt-6">
                                            <input
                                                type='text'
                                                className='w-full rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                                            />
                                        </div>
                                        <div>
                                            <div className='mb-5 grid grid-cols-1 mt-6'>

                                                <input
                                                    className='text-wrap  w-full text-md  text-gray-800 bg-gray-50 rounded-lg border  border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none  dark:border-gray-600 dark:placeholder-gray-400'
                                                    type='file'
                                                />
                                            </div>
                                        </div>
                                        <div className="flex mt-5">
                                            <span className="text-[22px] mt-2 mr-3 text-green-500"><BsFillCheckCircleFill /></span>
                                            <span className=" text-[30px] mt-1 text-red-500"><TiDelete /></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="container mx-auto grid grid-cols-1 mb-4">
                                <div className="flex justify-center items-center w-full">
                                    <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-full h-[8rem] bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                        <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                            <p className="text-md text-gray-500 dark:text-gray-400 card-title">Agregar Banner</p>
                                        </div>
                                        <input id="dropzone-file" type="file" className="hidden" />
                                    </label>
                                </div>
                            </div>

                        </div>
                        <div className='mb-[5rem]  h-[2rem] w-full grid '>
                            <div className="justify-self-end w-[18.9rem] ">
                                <label htmlFor='name' className='mb-2 font-semibold w-[10rem]'>
                                    Nombre de Insignia
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    className='w-full rounded-lg border border-slate-400 px-2 py-1 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40'
                                />
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