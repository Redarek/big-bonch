import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {API_URL} from "../../http";
import AuthService from "../../services/AuthService";
import {AuthResponse} from "../../types/AuthResponse";
import {ILoginUser, IRegUser, IUser} from "../../types/IUser";
import NftService from "../../services/NftService";
import {INftMetadata} from "../../types/INftMetadata";
import {ethers} from 'ethers';
declare var window: any
const contractAddr = '0x0B2e79a0d1ad7A38BF4e8Cde636e0525B8B76544'

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
    async (regObject: IRegUser) => {
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
    async (nftMetadata: INftMetadata) => {
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


export const fetchTokensByUserId = createAsyncThunk(
    '/tokens/:id',
    async (id: string, thunkAPI) => {
        try {
            const response = await NftService.fetchTokensByUserId(id)
            // console.log(response.data[0])
            let filteredNftMetadatas = []
            // фильтр для массива метаданных NFT. Если реальный адрес владельца NFT не совпадает с адресом игрока, то NFT фильтруется
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", [])
                const signer = provider.getSigner()
                const abi = [
                    "function ownerOf(uint256 tokenId) external view returns (address)",
                    "function mint(uint numberOfTokens) external payable",
                    "function balanceOf(address owner) view returns (uint256)"
                ]
                const contract = new ethers.Contract(
                    contractAddr,
                    abi, signer)
                    
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].tokenId !== undefined) {
                        const expected = response.data[i].expectedOwnerAddress
                        console.log('expected ' + expected)
                        const actual = await contract.ownerOf(ethers.BigNumber.from(Number(response.data[i].tokenId)))
                        console.log('actual ' + actual)
                            
                        if (expected.toUpperCase() === actual.toUpperCase()) {
                            filteredNftMetadatas.push(response.data[i])
                            console.log('NFT ' + response.data[i].name + ' выпущено и отобразилось')
                        } else {
                            console.log('NFT ' + response.data[i].name + ' выпущено и не отобразилось')
                        }
                    } else {
                        filteredNftMetadatas.push(response.data[i])
                        console.log('NFT ' + response.data[i].name + ' не выпущено и отобразилось')
                    }
                }
            }
            console.log('response: ', response)
            return filteredNftMetadatas;
        } catch (e) {
            return thunkAPI.rejectWithValue("Не удалось получить tokens")
        }
    }
)

export const fetchTokenFirstEverPass = createAsyncThunk(
    '/nft/first-ever-pass',
    async () => {
        try {
            const response = await NftService.fetchTokenFirstEverPass()
            return response.data
        } catch (e) {
            console.log(e);
        }
    }
)

export const patchNftMetadata = createAsyncThunk(
    '/token/:id',
    async (id: string, thunkAPI) => {
        try {
            const response = await NftService.patchNftMetadata(id)
            console.log(response.data)
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue("Не удалось выпустить NFT")
        }
    }
)

// const setActualOwnerOfNft= async (nftMetadatas:any) => {
//     const contractAddr = '0xd57354f4AbF8B0A15fc480874c70CB21260cee3d'
//     if (window.ethereum) {
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         await provider.send("eth_requestAccounts", [])
//         const signer = provider.getSigner()
//         const abi = [
//             "function ownerOf(uint256 tokenId) external view returns (address)",
//             "function mint(uint numberOfTokens) external payable",
//             "function balanceOf(address owner) view returns (uint256)"
//         ]
//         const contract = new ethers.Contract(
//             contractAddr,
//             abi, signer)
//         try {
//             // nftMetadatas.forEach (async (metadata, index) => {
//             //     const expected = metadata.expectedOwnerAddress
//             //     const actual = await contract.ownerOf(ethers.BigNumber.from(metadata.tokenId))
//             //     if (expected != actual) {
//             //         return metadata[index].expectedOwnerAddress = actual;
//             //     }
//             // })
//             const actualNftMetadatas = nftMetadatas.map(async (metadata:any, index:any) => {
//                 console.log(metadata)
//                 const expected = metadata.expectedOwnerAddress
//                 if (metadata.tokenId) {
//                     const actual = await contract.ownerOf(ethers.BigNumber.from(metadata.tokenId))
//                     if (expected === actual) {
//                         return metadata[index]
//                     }
//                 }
//             })
//             console.log(actualNftMetadatas)
//             return actualNftMetadatas
//             // console.log('response: ', response)
//         } catch (error) {
//             console.log("error", error)
//         }
//     }
// }
