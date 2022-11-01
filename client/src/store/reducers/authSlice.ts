import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AuthResponse} from "../../types/AuthResponse";
import {checkAuth,login, logout} from "./ActionCreators";

interface UserState {
    user: AuthResponse;
    walletAddress: string;
    isAuth: boolean;
    isLoading: boolean;
    result: string;
    error: string;
}

const initialState: UserState = {
    user: {} as AuthResponse,
    walletAddress: '',
    isAuth: false,
    isLoading: false,
    result: '',
    error: ''
}
const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserWalletAddress: (state, action: PayloadAction<string>) => {
            state.walletAddress = action.payload
        }
    },

    extraReducers: {
        [checkAuth.fulfilled.type]: (state, action: PayloadAction<AuthResponse>) => {
            state.isLoading = false;
            state.error = '';
            if (action.payload != undefined) {
                state.isAuth = true
                state.user = action.payload
            }
        },
        [checkAuth.pending.type]: (state) => {
            state.isLoading = true;
        },
        [checkAuth.rejected.type]: (state, action: PayloadAction<string>) => {
            state.error = action.payload
        },
        [login.fulfilled.type]: (state, action: PayloadAction<AuthResponse>) => {
            state.isLoading = false;
            state.error = '';
            if (action.payload != undefined) {
                state.isAuth = true;
                state.user = action.payload;
            }
        },
        [login.pending.type]: (state) => {
            state.isLoading = true;
        },
        [login.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload
        },
        [logout.fulfilled.type]: (state, action: PayloadAction<AuthResponse>) => {
            state.isLoading = false;
            state.error = '';
            state.isAuth = false;
            state.user = action.payload;
        },
        [logout.pending.type]: (state) => {
            state.isLoading = true;
        },
        [logout.rejected.type]: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload
        }
    }
})
export const {setUserWalletAddress} = authSlice.actions;
export default authSlice.reducer;
