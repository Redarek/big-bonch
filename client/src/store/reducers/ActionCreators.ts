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
            
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue("Не удалось получить tokens")
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
