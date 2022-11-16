import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {API_URL} from "../../http";
import AuthService from "../../services/AuthService";
import {AuthResponse} from "../../types/AuthResponse";
import {ILoginUser, IRegUser, IUser} from "../../types/IUser";
import NftService from "../../services/NftService";
import {INftMetadata} from "../../types/INftMetadata";






export const login = createAsyncThunk(
    'user/login',
    async (loginObject: ILoginUser) => {
        try {
            const response = await AuthService.login(loginObject.email, loginObject.password, loginObject.walletAddress);
            // console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }
)

export const registration = createAsyncThunk(
    'user/registration',
    async (regObject:IRegUser) => {
        try {
            const response = await AuthService.registration(regObject.email, regObject.universityData, regObject.password, regObject.walletAddress);
            // console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }
)

export const logout = createAsyncThunk(
    'user/logout',
    async () => {
        try {
            const response = await AuthService.logout();
            // console.log(response);
            localStorage.removeItem('token');
            return {} as IUser;
        } catch (e) {
            console.log(e);
        }
    }
)

export const checkAuth = createAsyncThunk(
    'user/auth',
    async () => {
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
            // console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }
)

export const postNftMetadata = createAsyncThunk(
    '/token-metadata',
    async (nftMetadata:INftMetadata) => {
        try {
            console.log('NFT metadata sent')
            console.log(nftMetadata)
            const response = await NftService.postNftMetadata(nftMetadata);
            return response.data;
        } catch (e) {
            console.log(e);
        }
    }
)
