import React, {FC} from 'react';
import cl from './ModalFullScreen.module.css'

interface ModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    children: React.ReactNode
}
const ModalFullScreen:FC<ModalProps>= ({visible, setVisible, children}) => {
    const rootClasses = [cl.modal];
    if (visible) {
        rootClasses.push(cl.active);
    }
    return (
        <div className={rootClasses.join(' ')} onClick={() => setVisible(false)}>
            <div className={cl.modalContent} onClick={event => event.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default ModalFullScreen;
