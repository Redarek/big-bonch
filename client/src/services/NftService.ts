import $api from '../http';
import {AxiosResponse} from 'axios';
import {INftMetadata} from '../types/INftMetadata';

export default class NftService {
    static async postNftMetadata(nftMetadata: INftMetadata): Promise<AxiosResponse<INftMetadata>> {
        return $api.post<INftMetadata>('/token-metadata', nftMetadata)
    }

    static async fetchTokensByUserId(id: string): Promise<AxiosResponse<INftMetadata[]>> {
        return $api.get<INftMetadata[]>(`/tokens/${id}`)
    }
    static async patchNftMetadata (id: string): Promise<AxiosResponse<INftMetadata>> {
        return $api.patch<INftMetadata>(`/token/${id}`)
    }
}
