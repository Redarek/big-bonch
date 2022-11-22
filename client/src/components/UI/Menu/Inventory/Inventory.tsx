import React, {FC, useEffect, useState} from 'react';
import cl from './Inventory.module.css'
import {useAppDispatch, useAppSelector} from "../../../../hooks/redux";
import {setNft} from "../../../../store/reducers/inventorySlice";
import {fetchTokensByUserId} from "../../../../store/reducers/ActionCreators";

interface InventoryProps {

}

const Inventory: FC<InventoryProps> = () => {
    const {nftsMetadata} = useAppSelector(state => state.nftSlice)
    const {nft} = useAppSelector(state => state.inventorySlice)
    const {user} = useAppSelector(state => state.authSlice.user)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTokensByUserId(user._id))
        setNft(
            {
                name: '',
                description: '',
                image: '',
                attributes: [],
            })
    }, [])

    const cardStyle = (ind: number) => {
        if (nft.name === nftsMetadata[ind].name) {
            return {backgroundColor: 'rgba(255,255,255, .1)'}
        }
    }
    console.log(nft)
    return (
        <div className={cl.inventory}>
            <div className={cl.info}>
                {/*<div className={cl.infoPlayer}>1</div>*/}
                <div className={cl.staff}>
                    {nftsMetadata.map((obj, index) =>
                        <div key={obj.tokenId} className={cl.card} style={cardStyle(index)}
                             onClick={() => dispatch(setNft(obj))}>
                            <img src={obj.image} alt=""/>
                        </div>
                    )}
                </div>
                {nft.name !== undefined
                    ? <div className={cl.infoAbout}>
                        <div className={cl.aboutHeader}>
                            <div className={cl.aboutImg}><img src={nft.image} alt=""/></div>
                            <div className={cl.aboutTitle}>{nft.name}</div>
                            <div className={cl.tokenId}>id: {nft.tokenId}</div>
                        </div>
                        <div className={cl.aboutDescription}>{nft.description}</div>
                        <div className={cl.attributes}>
                            {nft.attributes.map(att =>
                                <div className={cl.attribute}>
                                    {att.trait_type}: {att.value}
                                </div>
                            )}
                        </div>
                    </div>
                    : ''
                }
            </div>
        </div>
    );
};

export default Inventory;
