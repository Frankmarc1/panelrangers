import { collection, collectionGroup, getDocs } from 'firebase/firestore';
import { GetServerSideProps } from 'next';
import { FaMotorcycle, FaGripVertical } from 'react-icons/fa';
import { MdHomeWork } from 'react-icons/md';

import { db_client } from '../../firebase/client';
import { Dashboard } from '../../layout/Dashboard/Dashboard';

export const getServerSideProps: GetServerSideProps = async () => {
  const colMotorized = collection(db_client, 'users_motorizados');
  const snapMotorized = await getDocs(colMotorized);
  const colAgencies = collection(db_client, 'empresas_agencia');
  const snapAgencies = await getDocs(colAgencies);
  const colCompanies = collectionGroup(db_client, 'agencia_empresas');
  const snapCompanies = await getDocs(colCompanies);

  return {
    props: {
      totalMotorized: snapMotorized.size,
      totalAgencies: snapAgencies.size,
      totalCompanies: snapCompanies.size,
    },
  };
};

interface Props {
  totalMotorized: number;
  totalAgencies: number;
  totalCompanies: number;
}

const Statistics = (props: Props) => {
  return (
    <Dashboard>
      <div className='container m-auto md:grid md:grid-cols-2 md:gap-4 xl:grid xl:grid-cols-4 xl:gap-4 mt-5'>
        <div className='card card-side bg-base-100 shadow-xl grid grid-cols-2 mb-4'>
          <div className='w-full text-[6rem] bg-blue grid items-center place-content-center bg-cyan-500 text-white'>
            <FaMotorcycle />
          </div>
          <div className='card-body'>
            <h2 className='card-title'>Motorizados</h2>
            <p className='font-bold'> {props.totalMotorized} </p>
          </div>
        </div>

        <div className='card card-side bg-base-100 shadow-xl grid grid-cols-2 mb-4'>
          <div className='w-full text-[6rem] bg-blue grid items-center place-content-center bg-green-500 text-white'>
            <FaGripVertical />
          </div>
          <div className='card-body'>
            <h2 className='card-title'>Empresas</h2>
            <p className='font-bold'> {props.totalCompanies} </p>
          </div>
        </div>

        <div className='card card-side bg-base-100 shadow-xl grid grid-cols-2 mb-4'>
          <div className='w-full text-[6rem] bg-blue grid items-center place-content-center bg-slate-500 text-white'>
            <MdHomeWork />
          </div>
          <div className='card-body'>
            <h2 className='card-title'>Agencias</h2>
            <p className='font-bold'> {props.totalAgencies} </p>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Statistics;
