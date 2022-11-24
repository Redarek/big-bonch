import React, {FC, useEffect, useState} from 'react';
import cl from './Inventory.module.css'
import {useAppDispatch, useAppSelector} from "../../../../hooks/redux";
import {setNft} from "../../../../store/reducers/inventorySlice";
import {fetchTokensByUserId, patchNftMetadata} from "../../../../store/reducers/ActionCreators";

interface Reward {
    img: string;
    name: string
}

interface InventoryProps {
    setNotificationMintNFTIsVisible: (bool: boolean) => void;
    setNotificationItem: (obj: Reward) => void;
}


const Inventory: FC<InventoryProps> = ({setNotificationMintNFTIsVisible, setNotificationItem}) => {
    const {nftsMetadata} = useAppSelector(state => state.nftSlice)
    const {nft} = useAppSelector(state => state.inventorySlice)
    const {user} = useAppSelector(state => state.authSlice.user)
    const dispatch = useAppDispatch()


    const handeCreateNFT = () => {
        //создание и выпуск нфт

        dispatch(patchNftMetadata(nft._id))
        setNotificationItem({img: nft.image, name: nft.name})
        setNotificationMintNFTIsVisible(true)

    }
    useEffect(() => {
        dispatch(fetchTokensByUserId(user._id))
        setNft(
            {
                name: '',
                description: '',
                image: '',
                attributes: [],
                _id: '',
            })
    }, [])

    const cardStyle = (ind: number) => {
        if (ind)
        if (nft.name === nftsMetadata[ind].name) {
            return {backgroundColor: 'rgba(255,255,255, .1)'}
        }
    }
console.log(nftsMetadata);

    return (
        <div className={cl.inventory}>
            <div className={cl.info}>
                {/*<div className={cl.infoPlayer}>1</div>*/}
                <div className={cl.staff}>
                    {nftsMetadata[0] !== undefined
                    ?  nftsMetadata.map((obj, index) =>
                        <div key={obj._id} className={cl.card} style={cardStyle(index)}
                             onClick={() => dispatch(setNft(obj))}>
                            <img src={obj.image} alt=""/>
                        </div>
                    )          
                    :''
                    }
                </div>
                   
                {nft.name !== undefined
                    ? <div className={cl.infoAbout}>
                        <div className={cl.aboutHeader}>
                            <div className={cl.aboutImg}><img src={nft.image} alt=""/></div>
                            <div className={cl.aboutTitle}>{nft.name}</div>
                        </div>
                        <div className={cl.aboutDescription}>{nft.description}</div>
                        <div className={cl.attributes}>
                            {nft.attributes.map(att =>
                                <div key={att.trait_type} className={cl.attribute}>
                                    {att.trait_type}: {att.value}
                                </div>
                            )}
                        </div>
                        {nft.tokenId
                            ? ''
                            : <div className={cl.btn} onClick={() => handeCreateNFT()}>Выпустить NFT</div>
                        }
                    </div>
                    : ''
                }
            </div>
        </div>
    );
};

export default Inventory;
