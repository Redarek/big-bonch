import React, {FC, useEffect, useState} from 'react';
import cl from '../styles/MainPage.module.css'
import Canvas from "../components/Canvas";
import Menu from "../components/UI/Menu/Menu";
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import {setIsShow} from "../store/reducers/inventorySlice";

const MainPage: FC = () => {
    const {isShowMenu, menuTitle} = useAppSelector(state => state.inventorySlice)
    const dispatch = useAppDispatch()
    // const [isShowMenu, setIsShowMenu] = useState<boolean>(false)
    // const [menuIndex, setMenuIndex] = useState<number>(0)
    // useEffect(()=> {
    //     document.onkeydown = function (event) {
    //         switch (event.keyCode) {
    //             case 73: {
    //                 if (!isShowMenu) {
    //                     setIsShowMenu(true)
    //                     setMenuIndex(0)
    //                 } else setIsShowMenu(false)
    //             }
    //         }
    //     }
    // },[])
    return (
        <div className={cl.wrapper}>
            <Canvas/>
            {isShowMenu
                ? <Menu menuIndex={menuTitle}/>
                : ''
            }
        </div>
    );
};

export default MainPage;
