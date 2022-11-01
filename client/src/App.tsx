import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import {useAppDispatch, useAppSelector} from './hooks/redux';
import {checkAuth} from './store/reducers/ActionCreators';
import MetaMaskAuth from "./components/MetamaskConnect/MetaMaskAuth";

function App() {
    const {isAuth, isLoading, user, walletAddress} = useAppSelector(state => state.authSlice)
    const dispatch = useAppDispatch()

    const userId = localStorage.getItem("userId")
    // Проверка наличия токена доступа при первом запуске приложения
    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(checkAuth());
        }
    }, [])

    const [fetchWalletAddress, setFetchWalletAddress] = useState<string>("");
    return (
        <div className="App">
            {walletAddress === ''
                ? <MetaMaskAuth onAddressChanged={setFetchWalletAddress}/>
                : <BrowserRouter>
                    <div className="loader">
                        {isLoading
                            ? 'Loader will be soon...'
                            : ''
                        }
                    </div>
                    {isAuth
                        ? <div className="isAuth">
                            <div className="wrapper">
                                <AppRouter/>
                            </div>
                        </div>
                        : <AppRouter/>

                    }
                </BrowserRouter>
            }
        </div>
    );
}

export default App;
