import React, {FC} from 'react';
import cl from './Notification.module.css'
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {hideNotification} from "../../../store/reducers/notificationSlice";

interface NotificationProps {
}

const Notification: FC<NotificationProps> = () => {
    const {notificationItem} = useAppSelector(state => state.notificationSlice)
    const typeOfNot = () => {
        switch (notificationItem.type) {
            case 'GetItem':
                return {backgroundImage: `url(/images/notificationGetItem.png)`}
            case 'MintNFT':
                return {backgroundImage: `url(/images/notificationMintNFT.jpg)`}
        }
    }
    const dispatch = useAppDispatch()
    setTimeout(()=> {
        dispatch(hideNotification())
    }, 5000)
    return (
        <div className={cl.notification} style={typeOfNot()}>
            <div className={cl.rewardImg}>
                <img src={notificationItem.img} alt=""/>
            </div>
            {notificationItem.type === "GetItem"
                ? <div className={cl.rewardText}>
                    Получен<br/><span> {notificationItem.name}</span>
                </div>
                : ''
            }
            {notificationItem.type === "MintNFT"
                ? <div className={cl.rewardText}>
                    Выпущен<br/><span> {notificationItem.name}</span>
                </div>
                : ''
            }
        </div>
    );
};

export default Notification;
