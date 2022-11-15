import React, {FC, useEffect} from 'react';
import cl from '../styles/MainPage.module.css'
import Canvas from "../components/Canvas";
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import {fetchNftNumber} from "../store/reducers/ActionCreators";

const MainPage: FC = () => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchNftNumber())
    }, [])
    const {tokenId, isLoading} = useAppSelector(state => state.nftSlice)

    return (
        <div className={cl.wrapper}>
            {tokenId > -1
                ? <Canvas/>
                : ''
            }
        </div>
    );
};

export default MainPage;
