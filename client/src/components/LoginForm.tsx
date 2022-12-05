import React, {FC, useState} from "react";
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import {login} from "../store/reducers/ActionCreators";
import cl from "../styles/RegistrationForm.module.css";
import {useNavigate} from "react-router-dom";

const LoginForm: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const {walletAddress} = useAppSelector(state => state.authSlice)

    const handleLogin = (e: React.MouseEvent<HTMLElement>) => {
        dispatch(login({email: email, password: password, walletAddress: walletAddress}));
        navigate('/')
    }
    return (
        <div className={cl.auth}>
            <form className={cl.auth__form}>
                <div className={cl.auth__input_wrap}>

                    <input
                        className={cl.reg__input}
                        placeholder="Email"
                        name="email"
                        id="login-email"
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        type='text'
                    />
                </div>
                <div className={cl.auth__input_wrap}>
                    <input
                        className={cl.reg__input}
                        placeholder="Пароль"
                        type="password"
                        name="password"
                        id="login-password"
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                    />
                </div>
                <div className={cl.reg__btns}>
                    <div className={cl.reg__btn}
                            onClick={(e) => {
                                handleLogin(e)
                            }}
                    ><span>Войти</span>
                    </div>
                    <p
                       onClick={() => {
                           navigate("/registration");
                       }}
                    >Создать аккаунт
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
