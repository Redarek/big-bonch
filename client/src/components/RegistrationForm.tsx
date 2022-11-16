import React, {FC, useState} from "react";
import cl from "../styles/RegistrationForm.module.css";
import cx from "classnames";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import {registration} from "../store/reducers/ActionCreators";
import {IRegUser} from "../types/IUser";


const RegistrationForm: FC = () => {

    // const [name, setName] = useState<string>("");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {walletAddress, result, error} = useAppSelector(state => state.authSlice)

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [secondName, setSecondName] = useState<string>("");
    const [patronymic, setPatronymic] = useState<string>("");
    const [faculty, setFaculty] = useState<string>("");
    const [job, setJob] = useState<'Преподаватель' | 'Студент' | 'Сотрудник'>("Преподаватель");
    const [sex, setSex] = useState<'Мужской' | 'Женский' | 'Не знаю'>("Мужской");


    const handleRegistration = (e: React.MouseEvent<HTMLElement>) => {
        const user:IRegUser =
            {
                password: password,
                email: email,
                walletAddress: walletAddress,
                universityData: {
                    firstName: firstName,
                    secondName: secondName,
                    patronymic: patronymic,
                    faculty: faculty,
                    job: job,
                    sex: sex,
                }
            }
        dispatch(registration(user));
        setEmail('')
        setPassword('')
        setFirstName('')
        setSecondName('')
        setPatronymic('')
        setFaculty('')
        setJob("Преподаватель")
        setSex("Мужской")
        navigate('/')
        e.preventDefault()
    }


    // const handleRegistration = (e: any) => {
    //     dispatch(registration({email: email, password: password, name: name, walletAddress: walletAddress}))
    //     setEmail('')
    //     setPassword('')
    //     setName('')
    //     e.preventDefault();
    // }
    return (
        <div className={cl.auth}>
            <form className={cl.reg__form}>
                <label htmlFor='registration-email' className={cl.auth__label}>Email</label>
                <input
                    className={cx(cl.auth__input, cl.auth__input_email)}
                    placeholder="Введите email"
                    name="email"
                    id='registration-email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor='registration-password' className={cl.auth__label}>Пароль</label>
                <input
                    className={cx(cl.auth__input, cl.auth__input_password)}
                    placeholder="Введите пароль"
                    type="password"
                    name="password"
                    id='registration-password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor='registration-fName' className={cl.auth__label}>Имя</label>
                <input
                    className={cx(cl.auth__input, cl.auth__input_password)}
                    placeholder="Введите имя"
                    type="text"
                    name="name"
                    id='registration-fName'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <label htmlFor='registration-sName' className={cl.auth__label}>Фамилия</label>
                <input
                    className={cx(cl.auth__input, cl.auth__input_password)}
                    placeholder="Введите фамилию"
                    type="text"
                    name="name"
                    id='registration-sName'
                    value={secondName}
                    onChange={(e) => setSecondName(e.target.value)}
                />
                <label htmlFor='registration-patronymic' className={cl.auth__label}>Отчество</label>
                <input
                    className={cx(cl.auth__input, cl.auth__input_password)}
                    placeholder="Введите отчество"
                    type="text"
                    name="name"
                    id='registration-patronymic'
                    value={patronymic}
                    onChange={(e) => setPatronymic(e.target.value)}
                />
                <label htmlFor='registration-faculty' className={cl.auth__label}>Факультет</label>
                <input
                    className={cx(cl.auth__input, cl.auth__input_password)}
                    placeholder="Ваш факультет"
                    type="text"
                    name="name"
                    id='registration-faculty'
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                />
                <div className={cl.reg__radio}>
                    <div className={cl.reg__radio_btns}>
                        <label htmlFor='registration-teacher' className={cl.auth__label}>Преподаватель</label>
                        <input type="radio"
                               value={job}
                               checked={job === 'Преподаватель'}
                               name={'Преподаватель'}
                               onChange={() => setJob('Преподаватель')}
                               id={'registration-teacher'}
                        />
                    </div>
                    <div className={cl.reg__radio_btns}>
                        <label htmlFor='registration-student' className={cl.auth__label}>Студент</label>
                        <input type="radio"
                               value={job}
                               checked={job === "Студент"}
                               name={"Студент"}
                               onChange={() => setJob('Студент')}
                               id={'registration-student'}
                        />
                    </div>
                    <div className={cl.reg__radio_btns}>
                        <label htmlFor='registration-worker' className={cl.auth__label}>Сотрудник</label>
                        <input type="radio"
                               value={job}
                               checked={job === "Сотрудник"}
                               name={"Сотрудник"}
                               onChange={() => setJob('Сотрудник')}
                               id={'registration-worker'}
                        />
                    </div>
                </div>
                <div className={cl.reg__radio}>
                    <div className={cl.reg__radio_btns}>
                        <label htmlFor='registration-male' className={cl.auth__label}>Мужской</label>
                        <input type="radio"
                               value={sex}
                               checked={sex === 'Мужской'}
                               name={'Мужской'}
                               onChange={() => setSex('Мужской')}
                               id={'registration-male'}
                        />
                    </div>
                    <div className={cl.reg__radio_btns}>
                        <label htmlFor='registration-female' className={cl.auth__label}>Женский</label>
                        <input type="radio"
                               value={sex}
                               checked={sex === "Женский"}
                               name={"Женский"}
                               onChange={() => setSex('Женский')}
                               id={'registration-female'}
                        />
                    </div>
                    <div className={cl.reg__radio_btns}>
                        <label htmlFor='registration-unknown' className={cl.auth__label}>Не знаю</label>
                        <input type="radio"
                               value={sex}
                               checked={sex === "Не знаю"}
                               name={"Не знаю"}
                               onChange={() => setSex('Не знаю')}
                               id={'registration-unknown'}
                        />
                    </div>
                </div>
                <button
                    className={cx(cl.auth__button, cl.auth__button_registration)}
                    onClick={(e) => handleRegistration(e)}
                >Зарегистрироваться
                </button>
                <div
                    className={cl.auth__text}
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/login");
                    }}>
                    <p className={cl.auth__link}>Вход</p>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;
