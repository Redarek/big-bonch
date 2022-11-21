import React, {FC, useState} from 'react';
import cl from './Menu.module.css'
import Inventory from "./Inventory/Inventory";

interface MenuProps {
    setIsShowMenu: (bol: boolean) => void;

}

const Menu: FC<MenuProps> = ({setIsShowMenu}) => {
    const [menuIndex, setMenuIndex] = useState<number>(0)
    const menuWindows = [<Inventory/>]
    return (
        <div className={cl.menuWrap}>
            <div className={cl.menu}>
                <div className={cl.menuHeader}>
                    <h3 className={cl.menuTitle}>Inventory</h3>
                    <div className={cl.menuHeaderExitbtn} onClick={() => setIsShowMenu(false)}>
                        <span></span><span></span></div>
                </div>
                <div className={cl.menuContent}>
                    <div className={cl.menuNavWrap}>
                        <div className={cl.menuNavItem} onClick={() => setMenuIndex(0)}>Inventory</div>
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
