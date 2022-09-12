import { ReactNode, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import { Navbar } from './components/Navbar';
import { FaBars} from 'react-icons/fa';
import HeaderNav from './components/HeaderNav';

interface props {
  children: ReactNode | ReactNode[];
}
export const Dashboard = ({ children }: props) => {
  const [show, setShow] = useState(true)
  return (
    <>
      <Toaster
        position='top-right'
        gutter={8}
        reverseOrder={false}
        toastOptions={{ duration: 5000 }}
      />
     
      <div className="min-h-screen w-full bg-gray-100 text-gray-700" x-data="layout">
        <header className="flex w-full items-center justify-between border-b-2 border-gray-200 bg-white p-2">
          <div className="flex items-center space-x-2">
            <label tabIndex={0} onClick={() => setShow(!show)} className=' btn btn-ghost btn-circle'>
              <FaBars />
            </label>
          </div>

          <HeaderNav />
          
        </header >

        <div className="flex">
          {
            show ?
            <Navbar />: null

          }
       
          <main className='p-3 w-full'>{children}</main>
        </div>
      </div >


    </>
  );
};
