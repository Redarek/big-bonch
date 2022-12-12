import React, {FC, useEffect, useMemo, useState} from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { fetchTokenFirstEverPass } from '../../../store/reducers/ActionCreators';
import cl from './PopupWindow.module.css'

interface PopupWindow {
    reference: any;
    mouseMoveEvent: any;
    width: number;
    height: number;
    playerCoordinates: any
}

const PopupWindow: FC<PopupWindow> = ({width, height, mouseMoveEvent, reference, playerCoordinates}) => {
    const dispatch = useAppDispatch();

    const firstPopUpFixedX = 160;
    const firstPopUpFixedY = 550;
    let adaptX = width/2 - playerCoordinates.playerX;
    let adaptY = height/2 - playerCoordinates.playerY;

    const {nftMetadata} = useAppSelector(state => state.nftSlice)
    // useEffect(() => {
    //     dispatch(fetchTokenFirstEverPass)
    // }, [])
    const windows = [
        {x: adaptX + firstPopUpFixedX, y: adaptY + firstPopUpFixedY, text: `Бюро пропуско\nСамый первый студент:\n${nftMetadata.attributes[0].value} ${nftMetadata.attributes[1].value}`},
        {x: 750, y: 450, text: 'Второе всплывающее окно'}
    ]
    const [imagePos, setImagePos] = useState({x: 0, y: 0});
    //@ts-ignore
    const handlerMoveMouse = () => {
        //@ts-ignore
        const rect = reference.current.getBoundingClientRect();
        //@ts-ignore
        setImagePos({x: mouseMoveEvent.clientX - rect.x, y: mouseMoveEvent.clientY - rect.y});
    }

    useMemo(() => {
        handlerMoveMouse()
    }, [mouseMoveEvent])

    return (
        //@ts-ignore
        <div className={cl.popup} style={{width: width, height: height}}>
            {windows.map(window =>
                window.x >= imagePos.x - 50 &&
                window.x <= imagePos.x + 50 &&
                window.y >= imagePos.y - 50 &&
                window.y <= imagePos.y + 50
                    ?
                    <div key={window.text} className={cl.popupContent}
                         style={{left: imagePos.x, top: imagePos.y}}>
                        {window.text}
                    </div>
                    : ''
            )}

        </div>
    );
};

export default PopupWindow;
