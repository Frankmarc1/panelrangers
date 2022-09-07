import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { FloatingInput } from '../../components/Inputs/FloatingInput';
import { isValidName, saveRol } from './helpers/saveRol';

export const FormRol = () => {
  const [loading, setLoading] = useState(false);

  const handleForm = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const inputName = document.getElementById('name') as HTMLInputElement;
    const name = inputName.value;

    if (!name) {
      toast.error('Nombre se encuntra vacio.');

      return;
    }

    if (!isValidName(name)) {
      toast.error('Nombre no es valido.');
      return;
    }

    try {
      await saveRol(name);

      inputName.value = '';
      toast.success('Rol creado.');
    } catch {
      toast.error('Ocurrio un error al guardar los datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input type='checkbox' id='my-modal' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>Crear rol</h3>

          <form id='form_rol' onSubmit={handleForm}>
            <div className='my-2'>
              <FloatingInput placeholder='Nombre' id='name' name='name' />
            </div>
            <div className='modal-action'>
              <button
                className='btn btn-primary'
                type='submit'
                disabled={loading}
              >
                {loading ? 'Guardando' : 'Guardar'}
              </button>
              <label htmlFor='my-modal' className='btn btn-error'>
                Cancelar
              </label>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
