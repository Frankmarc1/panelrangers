import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';

interface props {
  children: ReactNode | ReactNode[];
}
export const Dashboard = ({ children }: props) => {
  return (
    <>
      <Toaster
        position='top-center'
        gutter={8}
        reverseOrder={false}
        toastOptions={{ duration: 5000 }}
      />
      <div className='h-screen'>
        <Navbar />
        <main className='p-3 w-full'>{children}</main>
      </div>
    </>
  );
};
