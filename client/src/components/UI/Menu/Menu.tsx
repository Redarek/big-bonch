import React, {FC, useEffect, useState} from 'react';
import cl from './Menu.module.css'
import Inventory from "./Inventory/Inventory";
import Quests from "./Quests/Quests";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {setIsShow, setTitle} from "../../../store/reducers/inventorySlice";
import Notification from "../Notification/Notification";

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
    const menuWindows = [<Inventory setNotificationItem={setNotificationItem} setNotificationMintNFTIsVisible={setNotificationMintNFTIsVisible}/>, <Quests/>]
    const dispatch = useAppDispatch()
    const title = () => {
        switch (menuIndex) {
            case 0:
                return 'Inventory';
            case 1:
                return 'Quests'
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
                        <div className={cl.itemTitle}>Progress:</div>
                        <div className={cl.menuNavItem} onClick={() => dispatch(setTitle(0))}>Inventory</div>
                        <div className={cl.itemTitle}>Combat:</div>
                        <div className={cl.menuNavItem} onClick={() => dispatch(setTitle(1))}>Quests</div>
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
