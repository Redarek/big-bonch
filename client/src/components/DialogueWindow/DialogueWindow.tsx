import React, {FC, useState} from 'react';
import cl from './DialogueWindow.module.css'

interface DialogueWindowProps {
    setVisible: (bool: boolean) => void;
    dialogueIndex: number
}

const DialogueWindow: FC<DialogueWindowProps> = ({setVisible, dialogueIndex}) => {

    const dialogues = [
        [
            {
                step: 0,
                speeches: [
                    {
                        speech: "hi"
                    },
                ],
                answers: [
                    {
                        text: "hello",
                        choiceNumber: 1,
                        number: 0,
                    },
                    {
                        text: "Привет",
                        choiceNumber: 2,
                        number: 1,
                    },
                    {
                        text: "Пока",
                        choiceNumber: 9,
                        number: 9,
                    },
                ]

            },
            {
                step: 1,
                speeches: [
                    {
                        speech: "Welcome to game",
                    },
                    {
                        speech: "Добро пожаловать в игру",
                    },
                ],
                answers: [
                    {
                        text: "Cool",
                        choiceNumber: 4,
                        number: 0,
                    },
                    {
                        text: "Круто",
                        choiceNumber: 3,
                        number: 1,
                    },
                    {
                        text: "Пока",
                        choiceNumber: 9,
                        number: 9,
                    },
                ]

            }
        ],
        [
            {
                step: 0,
                speeches: [
                    {
                        speech: "Это другой диалог"
                    },
                ],
                answers: [
                    {
                        text: "Awesome",
                        choiceNumber: 1,
                        number: 0,
                    },
                    {
                        text: "Потрясающе",
                        choiceNumber: 2,
                        number: 1,
                    },
                    {
                        text: "Пока",
                        choiceNumber: 9,
                        number: 9,
                    },
                ]

            },
        ]
    ]

    const [step, setStep] = useState<number>(0)

    const [userAnswers, setUserAnswers] = useState([])

    const handleAnswer = (answer: any) => {
        //@ts-ignore
        setUserAnswers([...userAnswers, answer.choiceNumber])
        setStep(step + 1);

        if (dialogues[dialogueIndex].length > step + 1)
            setDialogueHistory([...dialogueHistory, answer.text, dialogues[dialogueIndex][step + 1].speeches[answer.number].speech])
        else  {
            setDialogueHistory([...dialogueHistory, answer.text])
            setTimeout(() => {
                setVisible(false)
            }, 2000)
        }
        if (answer.choiceNumber === 9) setTimeout(() => {
            setVisible(false)
        }, 1000)
    }

    const [dialogueHistory, setDialogueHistory] = useState([dialogues[dialogueIndex][0].speeches[0].speech])
    return (
        <div className={cl.dialogue}>
            <div className={cl.companion}><img draggable={false} src={"/images/companion.png"} alt=""/></div>
            <div className={cl.dialogueArea}>
                <div className={cl.dialogueAreaContainer}>
                    {dialogueHistory.map(speech =>
                        <div key={speech}>
                            <div className={cl.speech}>
                                - {speech}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className={cl.answerArea}>
                {dialogues[dialogueIndex].length > step
                    ? dialogues[dialogueIndex][step].answers.map(answer =>
                        <div key={answer.choiceNumber} className={cl.answer} onClick={() => handleAnswer(answer)}>
                            {answer.text}
                        </div>
                    )
                    : ''
                }

            </div>
        </div>
    );
};

export default DialogueWindow;
