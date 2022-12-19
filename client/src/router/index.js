import MainPage from "../pages/MainPage";
import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";
import DialogueWindow from "../components/DialogueWindow/DialogueWindow";

export const publicRoutes = [
    {path: '/login', element: <LoginForm/>},
    {path: '/registration', element: <RegistrationForm/>},
];

export const privateRoutes = [
    ///
];
export const authRoutes = [
    {path: '/', element: <MainPage/>},
    {path: '/test', element: <DialogueWindow/>},
    // {path: '/login', element: <LoginForm/>},
    // {path: '/registration', element: <RegistrationForm/>},
];
