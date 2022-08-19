import { FirebaseError } from 'firebase/app';
import { useRouter } from 'next/router';
import { FormEvent, useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { handleSignIn } from '../app/signIn/helpers/SignIn';
import authErrors from '../app/signIn/types/authErrors';

const SignIn = () => {
  const refEmail = useRef<HTMLInputElement>(null);
  const refPass = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleForm = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    if (!refEmail.current || !refPass.current) {
      toast.error(
        'Email y/o contraseña no pueden ser leidos, intente nuevamente'
      );

      return;
    }

    try {
      let response = await handleSignIn(
        refEmail.current.value,
        refPass.current.value
      );

      if (response) {
        router.push('/dashboard');
      }
    } catch (err) {
      if (err instanceof FirebaseError) {
        const message = authErrors.get(err.message);

        if (message) toast.error(message);
        else toast.error('Error no registrado.');
      } else {
        toast.error('Ocurrio un error al revisar sus datos.');
      }
    }

    setLoading(false);
  };

  return (
    <div className='w-full flex justify-center items-center h-screen'>
      <Toaster
        position='top-center'
        gutter={8}
        reverseOrder={false}
        toastOptions={{ duration: 5000 }}
      />
      <div className='h-80 w-80 flex justify-center items-center flex-col bg-base-100  rounded shadow  p-3'>
        <h1 className='text-2xl mb-4 text-center'>Ingresar</h1>
        <form onSubmit={handleForm}>
          <input
            type={'email'}
            placeholder='Ingrese email'
            className='input input-sm w-full mb-4'
            name='email'
            ref={refEmail}
          />
          <input
            type={'password'}
            placeholder='Ingrese contraseña'
            className='input input-sm w-full mb-4'
            name='pass'
            ref={refPass}
          />
          <button className='w-full btn btn-primary btn-sm' disabled={loading}>
            {loading ? 'Cargando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
