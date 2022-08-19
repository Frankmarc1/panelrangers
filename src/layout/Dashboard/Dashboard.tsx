import { ReactNode } from 'react';
import { Navbar } from './components/Navbar';

interface props {
  children: ReactNode | ReactNode[];
}
export const Dashboard = ({ children }: props) => {
  return (
    <div className='w-screen h-screen'>
      <Navbar />
      <main className='p-3'>{children}</main>
    </div>
  );
};
