import { useRouter } from 'next/router';
import Modal from 'react-modal';
import Motorized from './../../[idMotorized]/../index';
import { ModalInfo } from './../../../../components/Motorized/ModalInfo';

Modal.setAppElement("#__next");
const Cartilla = () => {
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
    const router = useRouter();
    const { idMotorized } = router.query;
    return (
        <>
            <Motorized />
            <Modal
                isOpen={!! `motorizados/${idMotorized}/cartilla`}
                onRequestClose={() => router.push("/motorizados")}
                style={customStyles}
                
            >
                <ModalInfo />
            </Modal>
        </>

    );
}
export default Cartilla;