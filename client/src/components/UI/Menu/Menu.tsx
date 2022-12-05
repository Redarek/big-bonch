import React, {FC, useEffect, useState} from 'react';
import cl from './Menu.module.css'
import Inventory from "./Inventory/Inventory";
import Quests from "./Quests/Quests";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {setIsShow, setTitle} from "../../../store/reducers/inventorySlice";
import Notification from "../Notification/Notification";
import {logout} from "../../../store/reducers/ActionCreators";



interface MenuProps {
    // setIsShowMenu: (bol: boolean) => void;
    // setMenuIndex: (num: number) => void;
    menuIndex: number;
}

interface Reward {
    img: string;
    name: string
}

const Menu: FC<MenuProps> = ({menuIndex}) => {
    const [notificationMintNFTIsVisible, setNotificationMintNFTIsVisible] = useState<boolean>(false)
    const [notificationItem, setNotificationItem] = useState<Reward>({} as Reward)
    const menuWindows = [<Inventory setNotificationItem={setNotificationItem}
                                    setNotificationMintNFTIsVisible={setNotificationMintNFTIsVisible}/>, <div>NFT</div>,
        <Quests/>]
    const dispatch = useAppDispatch()
    const title = () => {
        switch (menuIndex) {
            case 0:
                return 'Инвентарь';
            case 1:
                return 'NFT'
            case 2:
                return 'Квесты'
            // case 3:return 'Настройки'
        }
    }
    return (
        <div className={cl.menuWrap}>
            {notificationMintNFTIsVisible
                ? <Notification type={"MintNFT"} setVisible={setNotificationMintNFTIsVisible} item={notificationItem}/>
                : ''
            }
            <div className={cl.menu}>
                <div className={cl.menuHeader}>
                    <h3 className={cl.menuTitle}>{title()}</h3>
                    <div className={cl.menuHeaderExitbtn} onClick={() => dispatch(setIsShow(false))}>
                        <span></span><span></span></div>
                </div>
                <div className={cl.menuContent}>
                    <div className={cl.menuNavWrap}>
                        <div className={cl.menuNav}>
                            <div className={cl.itemTitle}>Прогресс:</div>
                            <div className={cl.menuNavItem} onClick={() => dispatch(setTitle(0))}>Инвентарь</div>
                            <div className={cl.menuNavItem} onClick={() => dispatch(setTitle(1))}>NFT</div>
                        </div>
                        <div className={cl.menuNav}>
                            <div className={cl.itemTitle}>Задания:</div>
                            <div className={cl.menuNavItem} onClick={() => dispatch(setTitle(2))}>Квесты</div>
                        </div>
                        <div className={cl.menuNav}>
                            <div className={cl.itemTitle}>Настройки:</div>
                            <div className={cl.menuNavItem} onClick={() => dispatch(logout())}>Покинуть игру</div>
                        </div>
                    </div>
                    <div className={cl.menuWindow}>
                        {menuWindows[menuIndex]}
                    </div>


                </div>
            </div>
        </div>
    );
};

export default Menu;
