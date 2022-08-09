import { ReactNode } from 'react';
import {Navbar} from './components/Navbar';

interface props {
  children: ReactNode | ReactNode[];
}

export const Dashboard = ({ children }: props) => {

  return( 
    <div>
      <Navbar/>
      
    <main className='h-screen'>{children}</main>
  </div>
  );
};
