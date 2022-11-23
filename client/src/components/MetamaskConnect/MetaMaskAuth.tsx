import React, {useEffect, useState} from "react";
import styles from "./MetaMaskAuth.module.css";
import {useAppDispatch} from "../../hooks/redux";
import {setUserWalletAddress} from "../../store/reducers/authSlice";

//@ts-ignore
async function connect(onConnected) {
    //@ts-ignore
    if (!window.ethereum) {
        alert("Get MetaMask!");
        return;
    }

    //@ts-ignore
    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
    });

    onConnected(accounts[0]);
}

//@ts-ignore
async function checkIfWalletIsConnected(onConnected) {
    //@ts-ignore
    if (window.ethereum) {
        //@ts-ignore
        const accounts = await window.ethereum.request({
            method: "eth_accounts",
        });

        if (accounts.length > 0) {
            const account = accounts[0];
            onConnected(account);
            return;
        }
    }
}

//@ts-ignore
const MetaMaskAuth = ({onAddressChanged}) => {
    const dispatch = useAppDispatch()
    const [userAddress, setUserAddress] = useState("");

    useEffect(() => {
        checkIfWalletIsConnected(setUserAddress);
    }, []);

    useEffect(() => {
        onAddressChanged(userAddress);
        if (userAddress !== '') {
            dispatch(setUserWalletAddress(userAddress))
        }
    }, [userAddress]);

    return (
        <div>
            {userAddress
                ? ''
                : <div className={styles.metaMask}>
                    <div className={styles.foxBtn} onClick={() => connect(setUserAddress)}>
                        <img src="/images/fox.png" alt=""/>
                    </div>
                    <div className={styles.btn} onClick={() => connect(setUserAddress)}>
                        <p>Чтобы начать, нажми на лисёнка и подключись к MetaMask</p>
                    </div>
                </div>
            }
        </div>
    )
};

export default MetaMaskAuth;
