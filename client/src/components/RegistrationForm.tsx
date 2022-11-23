import React, {FC, useState} from "react";
import cl from "../styles/RegistrationForm.module.css";
import cx from "classnames";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import {registration} from "../store/reducers/ActionCreators";
import {IRegUser} from "../types/IUser";
import DropDownMenu from "./UI/DropDownMenu/DropDownMenu";


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
    const [faculty, setFaculty] = useState<string>("ИКСС");
    const [job, setJob] = useState<'Преподаватель' | 'Студент' | 'Сотрудник'>("Преподаватель");
    const [sex, setSex] = useState<'Мужской' | 'Женский' | 'Не знаю'>("Мужской");

    const radioStyle = (value:string) => {
        switch (value){
            case job: return {backgroundColor: 'rgba(222, 176, 123, 1)'}
            case sex: return {backgroundColor: 'rgba(222, 176, 123, 1)'}
        }
    }

    const handleRegistration = (e: React.MouseEvent<HTMLElement>) => {
        const user: IRegUser =
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
        setFaculty('ИКСС')
        setJob("Преподаватель")
        setSex("Мужской")
        navigate('/')
        e.preventDefault()
    }

    return (
        <div className={cl.auth}>
            <form className={cl.reg__form}>
                <div className={cl.reg__logo} onClick={()=> navigate('/login')}><img src="/images/blackLogo.svg" alt=""/></div>
                <label htmlFor='registration-email' className={cl.reg__label}>Email</label>
                <input
                    className={cx(cl.reg__input, cl.auth__input_email)}
                    placeholder="Email"
                    name="email"
                    id='registration-email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor='registration-password' className={cl.reg__label}>Пароль</label>
                <input
                    className={cx(cl.reg__input, cl.auth__input_password)}
                    placeholder="Пароль"
                    type="password"
                    name="password"
                    id='registration-password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor='registration-fName' className={cl.reg__label}>Имя</label>
                <input
                    className={cx(cl.reg__input, cl.auth__input_password)}
                    placeholder="Имя"
                    type="text"
                    name="name"
                    id='registration-fName'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <label htmlFor='registration-sName' className={cl.reg__label}>Фамилия</label>
                <input
                    className={cx(cl.reg__input, cl.auth__input_password)}
                    placeholder="Фамилия"
                    type="text"
                    name="name"
                    id='registration-sName'
                    value={secondName}
                    onChange={(e) => setSecondName(e.target.value)}
                />
                <label htmlFor='registration-patronymic' className={cl.reg__label}>Отчество</label>
                <input
                    className={cx(cl.reg__input, cl.auth__input_password)}
                    placeholder="Отчество"
                    type="text"
                    name="name"
                    id='registration-patronymic'
                    value={patronymic}
                    onChange={(e) => setPatronymic(e.target.value)}
                />
                <label htmlFor='registration-faculty' className={cl.reg__label} style={{marginBottom: '10px'}}>Факультет</label>
                <DropDownMenu
                    menuType={'faculty'}
                    title={faculty}
                    menuItems={[]}
                    dropMenuItem={'faculty'}
                    setDropMenuItem={setFaculty}
                    viewMode={"bottom"}
                />
                <label htmlFor='registration-teacher' className={cl.reg__label}>Должность</label>
                <div className={cl.reg__radio}>
                    <div className={cl.reg__radio_btn} style={radioStyle('Преподаватель')} onClick={()=> setJob('Преподаватель')}>
                        Преподаватель
                    </div>
                    <div className={cl.reg__radio_btn} style={radioStyle('Студент')} onClick={()=> setJob('Студент')}>
                        Студент
                    </div>
                    <div className={cl.reg__radio_btn} style={radioStyle('Сотрудник')} onClick={()=> setJob('Сотрудник')}>
                        Сотрудник
                    </div>
                </div>
                {/*<label htmlFor='registration-male' className={cl.reg__label}>Пол</label>*/}
                {/*<div className={cl.reg__radio}>*/}
                {/*    <div className={cl.reg__radio_btn} style={radioStyle('Мужской')} onClick={()=> setSex("Мужской")}>*/}
                {/*        Мужской*/}
                {/*    </div>*/}
                {/*    <div className={cl.reg__radio_btn} style={radioStyle('Женский')} onClick={()=> setSex("Женский")}>*/}
                {/*        Женский*/}
                {/*    </div>*/}
                {/*    <div className={cl.reg__radio_btn} style={radioStyle('Не знаю')} onClick={()=> setSex("Не знаю")}>*/}
                {/*        Не знаю*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className={cl.reg__btns}>
                    <button className={cl.reg__btn} style={{maxWidth: '400px'}}
                        onClick={(e) => handleRegistration(e)}
                    >Зарегистрироваться
                    </button>
                </div>
                {/*<div*/}
                {/*    className={cl.auth__text}*/}
                {/*    onClick={(e) => {*/}
                {/*        e.preventDefault();*/}
                {/*        navigate("/login");*/}
                {/*    }}>*/}
                {/*    <p className={cl.auth__link}>Вход</p>*/}
                {/*</div>*/}
            </form>
        </div>
    );
};

export default RegistrationForm;
