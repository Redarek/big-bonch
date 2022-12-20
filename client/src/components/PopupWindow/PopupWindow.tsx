import React, {FC, useMemo, useState} from 'react';
import {useAppSelector} from '../../hooks/redux';
import cl from './PopupWindow.module.css'
import DialogueWindow from "../DialogueWindow/DialogueWindow";

interface PopupWindowProps {
    reference: any;
    mouseMoveEvent: any;
    width: number;
    height: number;
    playerCoordinates: any
}

interface WindowParameters {
    x: number;
    y: number;
    text: string;
    dialogueId: number;
}

const PopupWindow: FC<PopupWindowProps> = ({width, height, mouseMoveEvent, reference, playerCoordinates}) => {
    const [dialogueWindowIsVisible, setDialogueWindowIsVisible] = useState<boolean>(false)

    const firstPopUpFixedX = 160;
    const firstPopUpFixedY = 550;
    let adaptX = width / 2 - playerCoordinates.playerX;
    let adaptY = height / 2 - playerCoordinates.playerY;

    const {nftMetadata} = useAppSelector(state => state.nftSlice)


    let passFirstName = 'undefined'
    let passLastName = 'undefined'
    if (nftMetadata.attributes !== null && nftMetadata !== null && nftMetadata.attributes !== undefined) {
        passFirstName = nftMetadata.attributes[0].value
        passLastName = nftMetadata.attributes[1].value
    }

    const windows: WindowParameters[] = [
        {
            x: adaptX + firstPopUpFixedX,
            y: adaptY + firstPopUpFixedY,
            text: `Бюро пропусков\nСамый первый студент:\n${passFirstName} ${passLastName}`,
            dialogueId: -1,
        },
        {
            x: 750,
            y: 450,
            text: 'Второе всплывающее окно',
            dialogueId: 1,
        }
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

    const [dialogueId, setDialogueId] = useState<number>(-1)
    return (
        //@ts-ignore
        <div className={cl.popup} style={{width: width, height: height}}>
            {windows.map(window =>
                window.x >= imagePos.x - 50 &&
                window.x <= imagePos.x + 50 &&
                window.y >= imagePos.y - 50 &&
                window.y <= imagePos.y + 50
                    ? <div>
                        <div
                            onClick={() => {
                                if (window.dialogueId > -1) {
                                    setDialogueId(window.dialogueId);
                                    setDialogueWindowIsVisible(true)
                                }
                            }}
                            key={window.text} className={cl.popupContent}
                            style={{left: imagePos.x, top: imagePos.y}}>
                            {window.text}
                        </div>
                    </div>
                    : ''
            )}
            {dialogueWindowIsVisible
                ? <DialogueWindow dialogueId={dialogueId} setVisible={setDialogueWindowIsVisible}/>
                : ''
            }
        </div>
    );
};

export default PopupWindow;
