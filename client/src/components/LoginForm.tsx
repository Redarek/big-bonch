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
                <input
                    className={cl.auth__input}
                    placeholder="Email"
                    name="email"
                    id="login-email"
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    type='text'
                />
                <input
                    className={cl.auth__input}
                    placeholder="Пароль"
                    type="password"
                    name="password"
                    id="login-password"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                />
                <div className={cl.auth__btns}>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            handleLogin(e)
                        }}
                    >Войти
                    </button>
                    <p onClick={() => {
                        navigate("/registration");
                    }}
                    ><a onClick={(e)=>e.preventDefault()} href="/registration">Создать аккаунт</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
