import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AuthResponse} from "../../types/AuthResponse";
import {checkAuth, login, logout, patchNftMetadata} from "./ActionCreators";
import {INftMetadata} from "../../types/INftMetadata";
import {useState} from "react";

interface InventoryState {
    menuTitle: number;
    isShowMenu: boolean;
    nft: INftMetadata;
    isLoading: boolean;
    error: string;
    // notificationItemIsVisible: boolean;
    // notificationMintNFTIsVisible: boolean;

}

const initialState: InventoryState = {
    isLoading: false,
    error: '',
    menuTitle: 0,
    isShowMenu: false,
    nft: {} as INftMetadata,
}
const inventorySlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setIsShow: (state, action: PayloadAction<boolean>) => {
            state.isShowMenu = action.payload
        },
        setTitle: (state, action: PayloadAction<number>) => {
            state.menuTitle = action.payload
        },
        setNft: (state, action: PayloadAction<INftMetadata>) => {
            state.nft = initialState.nft
            state.nft = action.payload
        }
    },

    extraReducers: {
        [patchNftMetadata.fulfilled.type]: (state, action: PayloadAction<INftMetadata>) => {
            state.error = '';
            state.nft = {
                ...action.payload,
                tokenId: '1'
            }
            console.log(action.payload)
            state.isLoading = false;
        },
        [patchNftMetadata.pending.type]: (state) => {
            state.isLoading = true;
        },
        [patchNftMetadata.rejected.type]: (state, action: PayloadAction<string>) => {
            state.error = action.payload
        },
    }
})
export const {setNft, setIsShow, setTitle} = inventorySlice.actions;
export default inventorySlice.reducer;
