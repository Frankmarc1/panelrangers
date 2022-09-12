import { doc, getDoc } from 'firebase/firestore';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import { Carnet } from '../../../app/motorized/Carnet';

import { db_client } from '../../../firebase/client';
import { Dashboard } from '../../../layout/Dashboard/Dashboard';
import { Motorized } from '../../../types/motorized';
import { Params } from '../../../types/params';

export const getServerSideProps: GetServerSideProps<{}, Params> = async (
  req
) => {
  const { idMotorized } = req.params as Params;

  const snap = await getDoc(doc(db_client, `users_motorizados/${idMotorized}`));

  return {
    props: {
      motorized: JSON.stringify(snap.data()),
    },
  };
};

Modal.setAppElement('#__next');

const customStyles = {
  content: {
    top: '15%',
    left: '42%',
    height: '27rem',
    borderRadius: '2rem',
    width: '80%',
    transform: 'translate(-40%, -10%)',
  },
};

interface Props {
  motorized: string;
}

const Cart = ({ motorized }: Props) => {
  const router = useRouter();
  const { idMotorized } = router.query;

  return (
    <>
      <Dashboard>
        <Modal
          isOpen={!!`motorizados/${idMotorized}/cartilla`}
          onRequestClose={() => router.push('/motorizados')}
          style={customStyles}
        >
          <Carnet motorized={JSON.parse(motorized) as Motorized} />
        </Modal>
      </Dashboard>
    </>
  );
};

export default Cart;
