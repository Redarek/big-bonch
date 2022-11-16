interface IUniversityData {
    firstName: string;
    secondName: string;
    patronymic: string;
    faculty: string;
    job: 'Преподаватель' | 'Студент' | 'Сотрудник'
    sex: 'Мужской' | 'Женский' | 'Не знаю'
}

export interface IUser {
    email: string;
    isActivated: boolean;
    _id: string;
    walletAddress: string;
    universityData: IUniversityData;
}

export interface IRegUser {
    walletAddress: string;
    email: string;
    password: string;
    universityData: IUniversityData
}

export interface ILoginUser {
    email: string;
    password: string;
    walletAddress: string;
}
