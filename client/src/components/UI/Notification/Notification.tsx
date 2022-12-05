import React, {FC} from 'react';
import cl from './Notification.module.css'

interface NotificationProps {
    type: "GetItem" | "MintNFT";
    item: {
        img: string;
        name: string
    },
    setVisible: (bool: boolean) => void
}

const Notification: FC<NotificationProps> = ({type, item, setVisible}) => {
    const typeOfNot = () => {
        switch (type) {
            case 'GetItem':
                return {backgroundImage: `url(/images/notificationGetItem.png)`}
            case 'MintNFT':
                return {backgroundImage: `url(/images/notificationMintNFT.jpg)`}
        }
    }
    setTimeout(()=> {
        setVisible(false)
    }, 5000)
    return (
        <div className={cl.notification} style={typeOfNot()}>
            <div className={cl.rewardImg}>
                <img src={item.img} alt=""/>
            </div>
            {type === "GetItem"
                ? <div className={cl.rewardText}>
                    Получен<br/><span> {item.name}</span>
                </div>
                : ''
            }
            {type === "MintNFT"
                ? <div className={cl.rewardText}>
                    Выпущен<br/><span> {item.name}</span>
                </div>
                : ''
            }
        </div>
    );
};

export default Notification;
