import React, {FC, useEffect, useState} from 'react';
import cl from './Inventory.module.css'
import {useAppDispatch, useAppSelector} from "../../../../hooks/redux";
import {setNft} from "../../../../store/reducers/inventorySlice";
import {fetchTokensByUserId, patchNftMetadata} from "../../../../store/reducers/ActionCreators";
import {ethers} from 'ethers'
import {showNotification} from "../../../../store/reducers/notificationSlice";
// const BASE_URL = process.env.NODE_ENV === "production" ? 'https://big-bonch.herokuapp.com' : 'http://localhost:8080';
declare var window: any


interface InventoryProps {
}


const Inventory: FC<InventoryProps> = () => {
        const {nftsMetadata} = useAppSelector(state => state.nftSlice)
        const {nft} = useAppSelector(state => state.inventorySlice)
        const {user} = useAppSelector(state => state.authSlice.user)
        const dispatch = useAppDispatch()


        const handeCreateNFT = () => {
            //@ts-ignore
            const mintNftAndMetadata = async () => {
                const contractAddr = '0x0B2e79a0d1ad7A38BF4e8Cde636e0525B8B76544'
                if (window.ethereum) {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    await provider.send("eth_requestAccounts", [])
                    const signer = provider.getSigner()
                    const abi = ["function mint(uint numberOfTokens) external payable"]
                    const contract = new ethers.Contract(
                        contractAddr,
                        abi, signer)
                    try {
                        //заглушка для metamask
                        // const response = 'res'
                        const response = await contract.mint(ethers.BigNumber.from(1), {
                            value: ethers.utils.parseEther("0.18"),
                        })
                        console.log('response: ', response)
                        dispatch(patchNftMetadata(nft._id))
                        dispatch(showNotification({type: "MintNFT", img: nft.image, name: nft.name}))
                    } catch
                        (err) {
                        console.log("error", err)
                    }
                }
            }

            mintNftAndMetadata();

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
                    expectedOwnerAddress: ''
                })
        }, [])

        const cardStyle = (ind: number) => {
            if (ind)
                if (nft.name === nftsMetadata[ind].name) {
                    return {backgroundColor: 'rgba(255,255,255, .1)'}
                }
        }
// console.log(nftsMetadata);

        return (
            <div className={cl.inventory}>
                <div className={cl.info}>
                    {/*<div className={cl.infoPlayer}>1</div>*/}
                    <div className={cl.staff}>
                        {nftsMetadata[0] !== undefined
                            ? nftsMetadata.map((obj, index) =>
                                <div key={obj._id} className={cl.card} style={cardStyle(index)}
                                     onClick={() => dispatch(setNft(obj))}>
                                    <img src={obj.image} alt=""/>
                                </div>
                            )
                            : ''
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
    }
;

export default Inventory;
