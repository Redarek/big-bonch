import React, {FC, useState} from 'react';
import cl from './DropDownMenu.module.css'

interface DropDownMenuProps {
    type: "faculty" | "string";
    position: "bottom" | "right"
    selectItem: any;
    setSelectItem: (variable: any) => void;
    items: any[];
}

const DropDownMenu: FC<DropDownMenuProps> = ({selectItem, items, setSelectItem, type, position}) => {
    const [visible, setVisible] = useState(false)

    let inputStyles = {}
    let itemsStyles = {}

    if (position === "right") {
        itemsStyles = {left: '60%', width: '40%', top: '0'};
        inputStyles = {width: '60%'};
    }

    const faculty = ["ИКСС", "ИСиТ", "РТС", "СЦТ", "ФФП", "ЦЭУБИ", "ИМ", "ИНО", "ВУЦ", "СПбКТ"]

    let itms = items
    switch (type) {
        case "faculty":
            itms = faculty
    }
    return (
        <div className={cl.container}>
            <input style={inputStyles} className={cl.input} type="text" value={selectItem} readOnly={true}
                   onFocus={() => setVisible(true)}
                   onBlur={() => setTimeout(() => setVisible(false), 100)}/>
            {visible
                ? <div className={cl.items} style={itemsStyles}>
                    {itms.map(item =>
                        <div className={cl.item} key={item} onClick={(e) => {
                            setSelectItem(item);
                            setVisible(false)
                        }}>{item}</div>
                    )}
                </div>
                : ''

            }
        </div>
    );
};

export default DropDownMenu;
