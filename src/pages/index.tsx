import { NextPage } from 'next';
import { Dashboard } from '../layout/Dashboard/Dashboard';

const Home: NextPage = () => {
  return (
    <Dashboard>
      <h1> Bienvenido </h1>
    </Dashboard>
  );
};

export default Home;
