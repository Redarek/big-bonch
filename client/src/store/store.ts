import {persistReducer, persistStore} from "redux-persist";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import authSlice from './reducers/authSlice'
import nftSlice from "./reducers/nftSlice";
import inventorySlice from "./reducers/inventorySlice";
import notificationSlice from "./reducers/notificationSlice";

const rootReducer = combineReducers({
    authSlice,
    nftSlice,
    inventorySlice,
    notificationSlice
})

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['authSlice', 'nftSlice', 'inventorySlice', 'notificationSlice']
};


const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);


export const setupStore = () => {
    return configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            })
    })
}
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
