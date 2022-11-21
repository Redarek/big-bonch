import $api from '../http';
import { AxiosResponse } from 'axios';
import { INftMetadata } from '../types/INftMetadata';

export default class NftService {
    static async postNftMetadata(nftMetadata: INftMetadata): Promise<AxiosResponse<INftMetadata>> {
        return $api.post<INftMetadata>('/token-metadata', nftMetadata)
    }
    static async fetchNfts(): Promise<AxiosResponse<INftMetadata[]>> {
        return $api.get<INftMetadata[]>('/tasks')
    }

}
