import React, {FC, ReactElement, useEffect, useRef, useState} from 'react';
import cl from './DialogueWindow.module.css'

interface DialogueStep {
    stepOfDialogue: number;
    speeches:
        {
            speech: ReactElement
        }[]
    playerAnswers: {
        speech: ReactElement;
        choiceNumber: number,
    }[]
}

interface Dialogue {
    dialogueId: number;
    steps: DialogueStep[]
}

interface DialogueWindowProps {
    setVisible: (bool: boolean) => void;
    dialogueId: number
}

const DialogueWindow: FC<DialogueWindowProps> = ({setVisible, dialogueId}) => {
    const dialogues: Dialogue[] = [
        {
            dialogueId: 1,
            steps: [
                {
                    stepOfDialogue: 0,
                    speeches: [
                        {
                            speech: <p>hi</p>
                        }
                    ],
                    playerAnswers: [
                        {
                            speech: <p>hello</p>,
                            choiceNumber: 1,
                        },
                        {
                            speech: <p>Привет</p>,
                            choiceNumber: 2,
                        },
                    ]
                },
                {
                    stepOfDialogue: 1,
                    speeches: [
                        {
                            speech: <p>Welcome to game</p>,
                        },
                        {
                            speech: <p>Добро пожаловать в игру</p>,
                        }
                    ],
                    playerAnswers: [
                        {
                            speech: <p>Cool</p>,
                            choiceNumber: 4,
                        },
                        {
                            speech: <p>Круто</p>,
                            choiceNumber: 3,
                        },
                    ]
                }
            ]
        },
        {
            dialogueId: 1,
            steps: [
                {
                    stepOfDialogue: 0,
                    speeches: [
                        {
                            speech: <p>Первый шаг</p>
                        },
                    ],
                    playerAnswers: [
                        {
                            speech: <p>Awesome</p>,
                            choiceNumber: 1,
                        },
                        {
                            speech: <p>Потрясающе</p>,
                            choiceNumber: 2,
                        },
                    ]

                },
                {
                    stepOfDialogue: 1,
                    speeches: [
                        {
                            speech: <p>Второй шаг диалога, <br/> первый варинт ответа</p>,
                        },
                        {
                            speech: <p>Второй шаг диалога, <br/> второй варинт ответа</p>,
                        },
                    ],
                    playerAnswers: [
                        {
                            speech: <p>Cool</p>,
                            choiceNumber: 4,
                        },
                        {
                            speech: <p>Круто</p>,
                            choiceNumber: 3,
                        },
                    ]

                },
                {
                    stepOfDialogue: 2,
                    speeches: [
                        {
                            speech: <p>Третий шаг диалога,<br/> первый варинт ответа</p>,
                        },
                        {
                            speech: <p>Третий шаг диалога, <br/> второй варинт ответау</p>,
                        },
                    ],
                    playerAnswers: [
                        {
                            speech: <p>Cool</p>,
                            choiceNumber: 4,
                        },
                        {
                            speech: <p>Круто</p>,
                            choiceNumber: 3,
                        },
                    ]

                },
            ]
        }
    ]


    const partings = ['Прощай', 'Пока', 'До свидания']
    const messageEndRef = useRef(null)
    const [stepOfDialogue, setStepOfDialogue] = useState<number>(0)

    const [userAnswers, setUserAnswers] = useState<number[]>([])

    const [dialogueHistory, setDialogueHistory] = useState([dialogues[dialogueId].steps[0].speeches[0].speech])

    const handleAnswer = (answer: any, index: number) => {

        setUserAnswers([...userAnswers, answer.choiceNumber])
        setStepOfDialogue(stepOfDialogue + 1);

        if (answer.choiceNumber === 9) {
            setDialogueHistory([...dialogueHistory, answer.speech, partings[Math.floor(Math.random() * (3))]])
            setTimeout(() => {
                setVisible(false)
            }, 1500)
        }
        if (dialogues[dialogueId].steps.length > stepOfDialogue + 1) {
            setDialogueHistory([...dialogueHistory, answer.speech, dialogues[dialogueId].steps[stepOfDialogue + 1].speeches[index].speech])
        } else {
            setDialogueHistory([...dialogueHistory, answer.speech])
        }
    }

    useEffect(() => {
        //@ts-ignore
        messageEndRef.current.scroll({
            top: 200,
            behavior: 'smooth'
        })
    }, [dialogueHistory])

    return (
        <div className={cl.dialogue}>
            <div className={cl.companion}><img draggable={false} src={"/images/companion.png"} alt=""/></div>
            <div className={cl.dialogueArea}>
                <div className={cl.dialogueAreaContainer} ref={messageEndRef}>
                    {dialogueHistory.map((speech, index) =>
                        <div key={index}>
                            <div className={cl.speech}>
                                - {speech}<br/>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className={cl.answerArea}>
                {dialogues[dialogueId].steps.length > stepOfDialogue
                    ? dialogues[dialogueId].steps[stepOfDialogue].playerAnswers.map((answer, index) =>
                        <div key={index} className={cl.answer} onClick={() => handleAnswer(answer, index)}>
                            {answer.speech}
                        </div>
                    )
                    : ''
                }
                <div className={cl.answer} onClick={() => handleAnswer({speech: 'Пока', choiceNumber: 9}, 9)}>
                    <p>Пока</p>
                </div>
            </div>
        </div>
    );
};

export default DialogueWindow;
