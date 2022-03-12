import { FunctionComponent } from 'react';
import CloseIcon from './icons/CloseIcon';

interface ModalProps {
    onClose: () => void;
    title: string;
}

const modalPosition = 'fixed p-4 top-0 left-0 h-page w-screen';

const Modal: FunctionComponent<ModalProps> = ({ onClose, title, children }) => {

    return (
        <div className={`${modalPosition} flex items-center justify-center`}>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`${modalPosition} bg-white opacity-40 z-modal-backdrop`}>
            </div>
            {/* Modal */}
            <div className="w-3/4 bg-white z-modal drop-shadow-xl">
                <div className="w-full p-1 flex justify-between items-center bg-deepfir text-white">
                    <p>{title}</p>
                    <CloseIcon onClick={onClose} sizeRem={2}/>
                </div>
                <div className="p-2">{children}</div>
            </div>
        </div>
    );
};

export default Modal;