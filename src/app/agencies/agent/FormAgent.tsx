import { FloatingInput } from '../../../components/Inputs/FloatingInput';

export const FormAgent = () => {
  return (
    <div>
      <div className='card bg-white pb-5  border'>
        <div className=' card-header border-b boder-slate-500  '>
          <h2 className='ml-[2rem]  card-title my-2'>Crear Agente</h2>
        </div>
        <div className='card-body'>
          <form autoComplete='off'>
            <div className='mb-3'>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <FloatingInput placeholder='Nombre' type={'text'} />
                </div>
                <div>
                  <FloatingInput placeholder='Dirección' type={'text'} />
                </div>
              </div>

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

            <button type='button' className=' w-full btn btn-primary btn-md'>
              Guardar Agente
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
