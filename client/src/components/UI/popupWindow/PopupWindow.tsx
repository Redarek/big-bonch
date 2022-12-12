import React, {FC, useMemo, useState} from 'react';
import cl from './PopupWindow.module.css'

interface PopupWindow {
    reference: any;
    mouseMoveEvent: any;
    width: number;
    height: number;
    playerCoordinates: any
}

const PopupWindow: FC<PopupWindow> = ({width, height, mouseMoveEvent, reference, playerCoordinates}) => {
    //@todo Кординаты игрока в компоненте
    // console.log(playerCoordinates)
    // console.log(playerCoordinates.playerY)
    // console.log(playerCoordinates.playerX)
    const firstPopUpFixedX = 2500
    const firstPopUpFixedY = 0
    let x = width/2 - playerCoordinates.playerX + firstPopUpFixedX
    let y = height/2 - playerCoordinates.playerY + firstPopUpFixedY
    // console.log(width, height)
    console.log(playerCoordinates.playerX, playerCoordinates.playerY)
    console.log(x,y)


    const windows = [
        {x: x, y: y, text: 'Первое всплывающее окно'},
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
                window.x >= imagePos.x - 5 &&
                window.x <= imagePos.x + 5 &&
                window.y >= imagePos.y - 5 &&
                window.y <= imagePos.y + 5
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
