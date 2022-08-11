import Image from "next/image";
import { FaMotorcycle, FaGripVertical } from "react-icons/fa";
import { MdHomeWork } from "react-icons/md";
import { Dashboard } from "../../../layout/Dashboard/Dashboard";
import { Navbar } from "../../../layout/Dashboard/components/Navbar";
const Statistics = () => {
  return (
    <Dashboard>
      <section className='bg-slate-200 h-full'>
        <div className='container m-auto md:grid md:grid-cols-2 md:gap-4 xl:grid xl:grid-cols-3 xl:gap-4 mt-5'>
          <div className='card card-side bg-base-100 shadow-xl grid grid-cols-2 mb-4'>
            <div className='w-full text-[8rem] bg-blue grid items-center place-content-center bg-cyan-500 text-white'>
              <FaMotorcycle />
            </div>
            <div className='card-body'>
              <h2 className='card-title'>Motorizados</h2>
              <p className='font-bold'>36</p>
            </div>
          </div>

          <div className='card card-side bg-base-100 shadow-xl grid grid-cols-2 mb-4'>
            <div className='w-full text-[8rem] bg-blue grid items-center place-content-center bg-green-500 text-white'>
              <FaGripVertical />
            </div>
            <div className='card-body'>
              <h2 className='card-title'>Agentes</h2>
              <p className='font-bold'>46</p>
            </div>
          </div>

          <div className='card card-side bg-base-100 shadow-xl grid grid-cols-2 mb-4'>
            <div className='w-full text-[8rem] bg-blue grid items-center place-content-center bg-slate-500 text-white'>
              <MdHomeWork />
            </div>
            <div className='card-body'>
              <h2 className='card-title'>Agencias</h2>
              <p className='font-bold'>2</p>
            </div>
          </div>
        </div>
      </section>
    </Dashboard>
  );
};
export default Statistics;
