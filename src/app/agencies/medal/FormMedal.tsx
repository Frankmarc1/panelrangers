import { FloatingInput } from "../../../components/Inputs/FloatingInput";

export const  FormMedal=() => {

    return (
        <div className="card bg-white pb-3  border">
            <div className="card-header border-b ">
                <h3 className="ml-[2rem] font-bold my-2 card-title">Crear Medallas</h3>
            </div>
            <div className="card-body">
                <form

                    autoComplete='off'
                >
                    <div className="container mx-auto grid grid-cols-1">
                        <div className='mb-5 grid grid-cols-1'>
                            <div className='flex items-center'>
                                <label className='block'>
                                    <span className='sr-only'>Selecionar foto</span>
                                    <input
                                        type='file'
                                        className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'


                                    />
                                </label>
                            </div>
                        </div>

                        <div className='mb-5 grid grid-cols-1'>
                            <div>
                                <FloatingInput
                                    placeholder='Nombres'
                                    type={'text'}

                                />
                            </div>
                        </div>

                        <div className='mb-5 grid grid-cols-1 w-full'>
                            <div>
                                <FloatingInput
                                    placeholder='Descripcion'
                                    type={'text'}

                                />
                            </div>
                        </div>

                        <div className='mb-[2rem] grid grid-cols-1'>
                            <div>
                                <FloatingInput
                                    placeholder='Beneficio'
                                    type={'number'}

                                />
                            </div>
                        </div>

                    </div>
                    <button type="submit" className="btn btn-primary btn-md">Guardar Medalla</button>
                </form>
            </div>
        </div>
    );
}
