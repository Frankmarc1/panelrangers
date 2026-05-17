import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { editMotorized } from '../../../app/motorized/helpers/editMotorized';
import { FloatingInput } from '../../../components/Inputs/FloatingInput';
import { db_client } from '../../../firebase/client';
import { Dashboard } from '../../../layout/Dashboard/Dashboard';
import { Agency } from '../../../types/agency';
import { Motorized } from '../../../types/motorized';
import { Params } from '../../../types/params';
import { Phase } from '../../../types/phase';

interface Props {
  motorized: Motorized;
  phases: Phase[];
  agencies: Agency[];
  idPhase: string;
  idAgency: string;
}

export interface MotorizedFields {
  dni: string;
  name: string;
  lastName: string;
  phone: string;
  brand: string;
  license_plate: string;
  color: string;
  date_exp_soat: string;
  date_exp_license: string;
  data_app: string;
  phase: string;
  agency: string;
  type_contract: string;
  percent: number;
  photo: FileList;
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  req
) => {
  const idMotorized = req.params?.idMotorized;

  if (!idMotorized) {
    return {
      redirect: {
        destination: '/motorizados',
        permanent: false,
      },
    };
  }

  const phases = (await getDocs(collection(db_client, 'fases'))).docs.map(
    (item) => item.data()
  ) as Phase[];

  const agencies = (
    await getDocs(collection(db_client, 'empresas_agencia'))
  ).docs.map((item) => item.data()) as Agency[];

  const snap = await getDoc(
    doc(db_client, 'users_motorizados', idMotorized)
  );

  if (!snap.exists()) {
    return {
      redirect: {
        destination: '/motorizados',
        permanent: false,
      },
    };
  }

  const data = snap.data();

  let idPhase = '';
  let idAgency = '';

  if (data?.reference_fase) {
    const phaseSnap = await getDoc(data.reference_fase);
    idPhase = phaseSnap.id ?? '';
  }

  if (data?.reference_agencia) {
    const agencySnap = await getDoc(data.reference_agencia);
    idAgency = agencySnap.id ?? '';
  }

  return {
    props: {
      phases: JSON.parse(JSON.stringify(phases)),
      agencies: JSON.parse(JSON.stringify(agencies)),
      motorized: JSON.parse(JSON.stringify(data)),
      idPhase,
      idAgency,
    },
  };
};

const EditMotorized = ({
  motorized,
  phases,
  agencies,
  idAgency,
  idPhase,
}: Props) => {
  const { register, setValue, handleSubmit } = useForm<MotorizedFields>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue('dni', motorized.profile?.dni ?? '');
    setValue('name', motorized.profile?.name ?? '');
    setValue('lastName', motorized.profile?.lastName ?? '');
    setValue('phone', motorized.phone ?? '');

    setValue('brand', motorized.movilidad?.marca ?? '');
    setValue('license_plate', motorized.movilidad?.placa ?? '');
    setValue('color', motorized.movilidad?.color ?? '');
    setValue('date_exp_soat', motorized.movilidad?.expiracionSoat ?? '');
    setValue(
      'date_exp_license',
      motorized.movilidad?.expiracionBrevete ?? ''
    );

    setValue('data_app', String(motorized.activo ?? false));
    setValue('type_contract', motorized.tipo_ranger ?? '');
    setValue('phase', idPhase ?? '');
    setValue('agency', idAgency ?? '');
    setValue('percent', motorized.porcentaje ?? 0);
  }, [motorized, idPhase, idAgency, setValue]);

  return (
    <Dashboard>
      <Head>
        <title>Editar motorizado</title>
      </Head>

      <section>
        <div className="card bg-base-100 shadow-xl pt-[1rem]">
          <div className="card-body">
            <form
              autoComplete="off"
              onSubmit={handleSubmit(async (data) => {
                try {
                  setLoading(true);

                  await editMotorized(
                    data,
                    'NB68AOkbkoNuQamclUuVuU5bVHG2',
                    motorized
                  );
                } finally {
                  setLoading(false);
                }
              })}
            >
              <div className="mb-3">
                <h2 className="text-sm font-bold mb-2">Datos personales</h2>

                <div className="mb-2 grid grid-cols-4 gap-4">
                  <div>
                    <FloatingInput placeholder="D.N.I" {...register('dni')} />
                  </div>

                  <div>
                    <FloatingInput
                      placeholder="Nombres"
                      {...register('name')}
                    />
                  </div>

                  <div>
                    <FloatingInput
                      placeholder="Apellidos"
                      {...register('lastName')}
                    />
                  </div>

                  <div>
                    <FloatingInput
                      placeholder="Telefono"
                      {...register('phone')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block">
                    <span className="sr-only">Foto</span>
                    <input
                      type="file"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      {...register('photo')}
                    />
                  </label>
                </div>
              </div>

              <div className="mb-3">
                <h2 className="text-sm font-bold mb-2">Datos del vehiculo</h2>

                <div className="mb-2 grid gap-4 grid-cols-3">
                  <div>
                    <FloatingInput
                      placeholder="Marca"
                      {...register('brand')}
                    />
                  </div>

                  <div>
                    <FloatingInput
                      placeholder="Placa"
                      {...register('license_plate')}
                    />
                  </div>

                  <div>
                    <FloatingInput
                      placeholder="Color"
                      {...register('color')}
                    />
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div>
                    <FloatingInput
                      placeholder="Fecha vencimiento del S.O.A.T"
                      type="date"
                      {...register('date_exp_soat')}
                    />
                  </div>

                  <div>
                    <FloatingInput
                      placeholder="Fecha vencimiento del brevete"
                      type="date"
                      {...register('date_exp_license')}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-bold mb-2">
                  Datos para la empresa
                </h2>

                <div className="mb-2 grid grid-cols-4 gap-4">
                  <select
                    defaultValue=""
                    id="datos_app"
                    className="select input-md w-full mb-4 block px-2.8 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    {...register('data_app')}
                  >
                    <option value="">Seleccionar datos</option>
                    <option value="false">Pendientes</option>
                    <option value="true">Completados</option>
                  </select>

                  <select
                    defaultValue=""
                    id="fases"
                    className="select input-md w-full mb-4 block px-2.8 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    {...register('phase')}
                  >
                    <option value="">Seleccionar fase</option>

                    {React.Children.toArray(
                      phases.map((phase) => (
                        <option value={phase.id}>{phase.name}</option>
                      ))
                    )}
                  </select>

                  <select
                    className="select input-md w-full mb-4 block px-2.8 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    {...register('agency')}
                    defaultValue=""
                  >
                    <option value="">Seleccionar agencia</option>

                    {React.Children.toArray(
                      agencies.map((agency) => (
                        <option value={agency.id}>{agency.nombre}</option>
                      ))
                    )}
                  </select>

                  <select
                    className="select input-md w-full mb-4 block px-2.8 pb-2.5 pt-4 text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    {...register('type_contract')}
                    defaultValue=""
                  >
                    <option value="">Seleccionar tipo de contrato</option>
                    <option value="parttime">Part time</option>
                    <option value="comision">Comisión</option>
                  </select>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <FloatingInput
                      placeholder="Porcentaje"
                      type="number"
                      {...register('percent')}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full btn-sm"
                disabled={loading}
              >
                {loading ? 'Actualizando...' : 'Actualizar Motorizado'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </Dashboard>
  );
};

export default EditMotorized;