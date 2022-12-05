import React, {FC, useMemo, useState} from 'react';
import cl from './PopupWindow.module.css'

interface PopupWindow {
    reference: any;
    mouseMoveEvent: any;
    width: number;
    height: number;
}

const PopupWindow: FC<PopupWindow> = ({width, height, mouseMoveEvent, reference}) => {

    const coordinates = [
        {x: 500, y: 130, text: 'Первое всплывающее окно'},
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
            {coordinates.map(coordinate =>
                coordinate.x >= imagePos.x - 30 &&
                coordinate.x <= imagePos.x + 30 &&
                coordinate.y >= imagePos.y - 30 &&
                coordinate.y <= imagePos.y + 30
                    ?
                    < div key={coordinate.text} className={cl.popupContent}
                          style={{left: imagePos.x, top: imagePos.y}}>{coordinate.text}</div>
                    : ''
            )}

        </div>
    );
};

export default PopupWindow;
