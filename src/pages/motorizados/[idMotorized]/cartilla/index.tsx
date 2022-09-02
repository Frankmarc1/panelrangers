import { useRouter } from 'next/router';
import Modal from 'react-modal';
import {ModalInfo} from './../../../../components/Motorized/modalInfo';

Modal.setAppElement("#__next");
const Cartilla = () => {
    const customStyles = {
        content: {
          top: '15%',
          left: '45%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          borderRadius: '2rem',
          width: '80%',
          transform: 'translate(-40%, -10%)',
        },
      };
    const router = useRouter();
    const { idMotorized } = router.query;
    return (
        <div >
            <Modal
                isOpen={!! `motorizados/${idMotorized}/cartilla`}
                onRequestClose={() => router.push("/motorizados")}
                style={customStyles}

            >
                <ModalInfo/>
            </Modal>
        </div>
    );
}
export default Cartilla;