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
        if (userAddress !== '') dispatch(setUserWalletAddress(userAddress))
    }, [userAddress]);

    return (
        <div>
            {userAddress
                ? <div></div>
                : <button className={styles.button} onClick={() => connect(setUserAddress)}>
                    Connect to MetaMask
                </button>
            }
        </div>
        // <div>
        //     Connected with
        //     <span
        //         className={styles.address}>
        //         {userAddress.substring(0, 5)}
        //         …{userAddress.substring(userAddress.length - 4)}
        //     </span>
        // </div>
    )
};

export default MetaMaskAuth;
