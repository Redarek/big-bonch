import React, {FC, useEffect, useState} from 'react';
import cl from './DropDownMenu.module.css'

interface DropDownMenuProps {
    menuType: 'faculty' | 'other';
    title: string;
    menuItems: any[];
    dropMenuItem: string;
    setDropMenuItem: (item: string) => void;
    viewMode: 'right' | 'bottom'
    setIndexOfSelectElem?: (index: number) => void;
    indexOfMenu?: string;
    indexOfOpenMenu?: string;
    setIndexOfOpenMenu?: (index: string) => void;
}

const DropDownMenu: FC<DropDownMenuProps> = ({
                                                 title,
                                                 menuItems,
                                                 dropMenuItem,
                                                 setDropMenuItem,
                                                 menuType,
                                                 viewMode,
                                                 setIndexOfSelectElem,
                                                 indexOfMenu,
                                                 indexOfOpenMenu,
                                                 setIndexOfOpenMenu,
                                             }) => {
    const faculty = ["ИКСС", "ИСиТ", "РТС", "СЦТ", "ФФП", "ЦЭУБИ", "ИМ", "ИНО", "ВУЦ", "СПбКТ"]
    let items: any[] = []
    switch (menuType) {
        case 'other':
            items = menuItems;
            break;
        case "faculty":
            items = faculty
            break;
    }

    const wrapStyle = {width: '75%'}
    const menuListWrapStyle = {width: '240px', left: '75%', marginTop: '0'}

    switch (viewMode) {
        case "bottom":
            wrapStyle.width = '100%'
            menuListWrapStyle.width = '100%'
            menuListWrapStyle.left = '0'
            menuListWrapStyle.marginTop = '42px'
            break;
    }

    const [visible, setVisible] = useState(false)
    useEffect(() => {
        if (indexOfOpenMenu !== indexOfMenu) setVisible(false)
    }, [indexOfOpenMenu])

    const checkSetOpenMenuTitle = () => {
        if (setIndexOfOpenMenu && indexOfMenu) {
            setIndexOfOpenMenu(indexOfMenu);
        }
        setVisible(!visible);
    }

    return (
        <div className={cl.wrapper}>
            <div className={cl.wrap} style={wrapStyle} onClick={() => {
                checkSetOpenMenuTitle();
                setVisible(!visible);
            }}>
                <div
                    className={cl.menuTitle}>{dropMenuItem === '' ? title : items[items.findIndex(obj => obj === title)]}</div>
                <div className={cl.menuIcon}></div>
            </div>
            {visible
                ?
                <div className={cl.menuListWrap} style={menuListWrapStyle}>
                    {items.map((item, index) =>
                        <div key={item} className={cl.menuItem} onClick={() => {
                            setDropMenuItem(item);
                            if (setIndexOfSelectElem) setIndexOfSelectElem(index)
                            setVisible(false)
                        }}>
                            {item}
                        </div>
                    )}
                </div>
                : ''
            }
        </div>
    );
};

export default DropDownMenu;
