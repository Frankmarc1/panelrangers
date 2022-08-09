import { ReactNode } from 'react';

interface props {
  children: ReactNode | ReactNode[];
}

export const Dashboard = ({ children }: props) => {
  return <div>{children}</div>;
};
