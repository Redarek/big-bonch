import $api from '../http';
import {AxiosResponse} from 'axios';
import {AuthResponse} from '../types/AuthResponse';

export default class AuthService {
    static async login(email: string, password: string, walletAddress: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/login', {email, password, walletAddress})
    }

    static async registration(email: string, password: string, name: string, walletAddress: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/registration', {email, password, name, walletAddress})
    }

    static async logout(): Promise<void> {
        return $api.post('/logout')
    }
}
