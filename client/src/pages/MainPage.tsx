import React, {FC} from 'react';
import cl from '../styles/MainPage.module.css'
import Canvas from "../components/Canvas";

const MainPage:FC = () => {
    return (
        <div className={cl.wrapper}>
            <Canvas/>
        </div>
    );
};

export default MainPage;
