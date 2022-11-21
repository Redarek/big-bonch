import React, {FC, useEffect, useState} from 'react';
import cl from '../styles/MainPage.module.css'
import Canvas from "../components/Canvas";
import Menu from "../components/UI/Menu/Menu";

const MainPage: FC = () => {
    const [isShowMenu, setIsShowMenu] = useState<boolean>(false)
    return (
        <div className={cl.wrapper}>
             <Canvas/>
            <div className={cl.menuBtn} onClick={()=> setIsShowMenu(!isShowMenu)}>
                show menu
            </div>
            {isShowMenu
                ? <Menu setIsShowMenu={setIsShowMenu}/>
                : ''
            }
        </div>
    );
};

export default MainPage;
