import $api from '../http';
import {AxiosResponse} from 'axios';
import { INft } from '../types/INft';

export default class NftService {
    static async mintNft(nft: INft): Promise<AxiosResponse<INft>> {
        return $api.post<INft>('/mint-nft', nft)
    }

    static async getNumberOfNfts(): Promise<AxiosResponse<number>> {
        return $api.get<number>('/token-id')
    }
}
