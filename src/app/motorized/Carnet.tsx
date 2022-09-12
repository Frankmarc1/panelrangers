import { doc, getDoc } from 'firebase/firestore';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { db_client } from '../../firebase/client';
import { Agency } from '../../types/agency';
import { Motorized } from '../../types/motorized';

interface Props {
  motorized: Motorized;
}

export const Carnet = ({ motorized }: Props) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ fase: '', agencia: '', nameUpdate: '' });
  const router = useRouter();
  const { idMotorized } = router.query;

  useEffect(() => {
    const motorizedDoc = doc(db_client, `users_motorizados/${idMotorized}`);

    getDoc(motorizedDoc)
      .then(async (snap) => {
        const motorized = snap.data() as Motorized;

        if (motorized.reference_fase) {
          const phase = (await getDoc(motorized.reference_fase)).data() as {
            name: string;
          };
          data.fase = phase.name;
        }

        if (motorized.reference_agencia) {
          const agency = (
            await getDoc(motorized.reference_agencia)
          ).data() as Agency;
          data.agencia = agency.nombre;
        }

        if (motorized.reference_master) {
          const master = (await getDoc(motorized.reference_master)).data() as {
            username: string;
          };

          data.nameUpdate = master.username;
        }

        setData(data);
      })
      .catch(() =>
        setData({
          fase: '',
          nameUpdate: '',
          agencia: '',
        })
      )
      .finally(() => setLoading(false));
  }, [idMotorized]);

  return (
    <div className='w-full h-full'>
      <div className=' card-header border-b flex justify-between border-slate-300 py-[1rem] mt-[-1.5rem] '>
        <h3 className='card-title'>Información del motorizado</h3>

        <Link href={'/motorizados'}>
          <a>
            <FaTimes />
          </a>
        </Link>
      </div>
      <div className='card-body h-[20rem] mt-[-1.6rem] ml-[-2rem] my-3'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <h4 className='card-title text-md mb-2'>Datos del ranger</h4>
            <p className='mb-2 font-medium text-md'>
              <span className='text-xs font-semibold mr-1'>D.N.I: </span>
              <span className='text-sm'>{motorized.profile.dni} </span>
            </p>
            <p className='mb-2 font-medium text-md'>
              <span className='text-xs font-semibold mr-1'>Nombre: </span>
              <span className='text-sm'>{motorized.profile.name} </span>
            </p>
            <p className='mb-2 font-medium text-md'>
              <span className='text-xs font-semibold mr-1'>Apellidos: </span>
              <span className='text-sm'>{motorized.profile.lastName} </span>
            </p>
            <p className='mb-2 font-medium text-md'>
              <span className='text-xs font-semibold mr-1'>
                Datos en la app:{' '}
              </span>
              <span className='text-sm'>
                {motorized.activo ? 'Completados' : 'Pendientes'}{' '}
              </span>
            </p>
            <p className='mb-2 font-medium text-md'>
              <span className='text-xs font-semibold mr-1'>Estado: </span>
              <span className='text-sm'>{motorized.status} </span>
            </p>
            <p className='mb-2 font-medium text-md'>
              <span className='text-xs font-semibold mr-1'>Fase: </span>
              <span className='text-sm'> {loading ? '...' : data.fase} </span>
            </p>
            <p className='mb-3 font-medium text-md'>
              <span className='text-xs font-semibold mr-1'>Agencia: </span>
              <span className='text-sm'>
                {' '}
                {loading ? '...' : data.agencia}{' '}
              </span>
            </p>
          </div>
          <div>
            <h4 className='card-title text-md mb-2'>Datos de movilidad</h4>
            <p className='mb-2 font-medium text-md'>
              <span className='text-xs font-semibold mr-1'>
                Fecha de vencimiento del brevete:
              </span>
              <span className='text-sm'>
                {motorized.movilidad.expiracionBrevete}{' '}
              </span>
            </p>
            <p className='mb-3 font-medium text-md'>
              <span className='text-xs font-semibold mr-1'>
                Fecha de vencimiento del soat:
              </span>
              <span className='text-sm'>
                {motorized.movilidad.expiracionSoat}{' '}
              </span>
            </p>
            <p className='mb-3 font-medium text-md'>
              <span className='text-xs font-semibold mr-1'>Marca:</span>
              <span className='text-sm'>{motorized.movilidad.marca} </span>
            </p>
            <p className='mb-3 font-medium text-md'>
              <span className='text-xs font-semibold mr-1'>Color:</span>
              <span className='text-sm'>{motorized.movilidad.color} </span>
            </p>
            <p className='mb-3 font-medium text-md'>
              <span className='text-xs font-semibold mr-1'>Placa:</span>
              <span className='text-sm'>{motorized.movilidad.placa} </span>
            </p>
          </div>
        </div>
      </div>

      <div className=' card-footer border-t border-slate-300 py-[1rem] mb-[-1.5rem]'>
        <p className='text-xs'>
          {loading
            ? '...'
            : `Modificado por ultima vez el 
					${DateTime.fromSeconds(motorized.timeUpdate.seconds).toFormat(
            'dd-MM-yyyy'
          )} por ${data?.nameUpdate} `}
        </p>
      </div>
    </div>
  );
};
