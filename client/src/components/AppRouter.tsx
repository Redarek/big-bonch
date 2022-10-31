import React, {FC} from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import {authRoutes, publicRoutes} from "../router";
import {useAppSelector} from "../hooks/redux";

const AppRouter: FC = () => {
    const {isAuth} = useAppSelector(state => state.authSlice)
    return (
        <Routes>
            {isAuth
                ? publicRoutes.map(route =>
                    <Route
                        key={route.path}
                        element={route.element}
                        path={route.path}
                    />
                )
                : authRoutes.map(route =>
                    <Route
                        key={route.path}
                        element={route.element}
                        path={route.path}
                    />
                )
            }
            {isAuth
                ? <Route path="*" element={<Navigate replace to="/"/>}/>
                : <Route path="*" element={<Navigate replace to="/login"/>}/>
            }
        </Routes>
    );
};

export default AppRouter;
