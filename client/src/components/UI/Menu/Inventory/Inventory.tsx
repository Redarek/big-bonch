import React, {FC, useEffect, useState} from 'react';
import cl from './Inventory.module.css'
import {useAppDispatch} from "../../../../hooks/redux";
import {setNft} from "../../../../store/reducers/inventorySlice";

interface InventoryProps {

}

const Inventory: FC<InventoryProps> = () => {

    const objcts = ['obj1', 'obj2', 'obj2', 'obj3', 'obj4', 'obj5', 'obj6']
    const dispatch = useAppDispatch()
    return (
        <div className={cl.inventory}>
            <div className={cl.info}>
                <div className={cl.infoPlayer}>1</div>
                <div className={cl.infoAbout}>2</div>
            </div>
            <div className={cl.staff}>
                {objcts.map((obj)=>
                    <div key={obj} className={cl.card} onClick={()=> dispatch(setNft(obj))}>{obj}</div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
