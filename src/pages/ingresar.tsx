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

    if (!refEmail.current || !refPass.current) {
      toast.error('Email y/o contraseña no pueden ser leídos, intente nuevamente');
      return;
    }

    try {
      setLoading(true);

      const response = await handleSignIn(
        refEmail.current.value,
        refPass.current.value
      );

      if (response) {
  router.replace('/dashboard');
}
    } catch (err) {
      if (err instanceof FirebaseError) {
        const message = authErrors.get(err.message);

        if (message) toast.error(message);
        else toast.error('Error no registrado.');
      } else {
        toast.error('Ocurrió un error al revisar sus datos.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-screen">
      <Toaster
        position="top-center"
        gutter={8}
        reverseOrder={false}
        toastOptions={{ duration: 5000 }}
      />

      <div className="h-80 w-80 flex justify-center items-center flex-col bg-base-100 border-2 border-cyan-50 rounded-xl shadow p-3">
        <h1 className="text-2xl mb-5 text-center">Ingresar</h1>

        <form onSubmit={handleForm} autoComplete="off">
          <div className="relative w-full">
            <input
              type="email"
              placeholder="Ingrese email"
              className="input input-md w-full mb-4 block px-2.8 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              name="email"
              ref={refEmail}
              required
            />

            <label
              htmlFor="email"
              className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 pointer-events-none"
            >
              Ingrese email
            </label>
          </div>

          <div className="relative w-72">
            <input
              type="password"
              placeholder="Ingrese contraseña"
              className="input input-md w-full mb-4 block px-2.5 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              name="pass"
              id="pass"
              ref={refPass}
              required
            />

            <label
              htmlFor="pass"
              className="absolute text-md text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 pointer-events-none"
            >
              Ingrese contraseña
            </label>
          </div>

          <button className="w-full btn btn-primary btn-md" disabled={loading}>
            {loading ? 'Cargando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;